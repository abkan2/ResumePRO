require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO server
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust this to match your frontend origin
    methods: ['GET', 'POST'],
  },
});

// Store user data (resume and conversation history) per socket connection
const userData = {};

// OpenAI API Call Function with Streaming
const callOpenAIStream = async (messages, socket, eventName, updateConversationHistory) => {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        model: 'gpt-4',
        messages: messages,
        stream: true,
      },
      responseType: 'stream',
    });

    let buffer = '';

    response.data.on('data', (chunk) => {
      const payloads = chunk.toString().split('\n\n');
      for (const payload of payloads) {
        if (payload.includes('[DONE]')) return;
        if (payload.startsWith('data:')) {
          const data = payload.replace('data: ', '');
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0].delta.content;
            if (content) {
              buffer += content;
              // Optionally emit typing indicator
              socket.emit(`${eventName}_typing`);
            }
          } catch (error) {
            console.error('Error parsing OpenAI stream chunk:', error);
          }
        }
      }
    });

    // After the response data is fully received
response.data.on('end', () => {
  // Stream finished
  try {
    // Try to parse the assistant's full response
    const assistantResponse = buffer.trim();

    // Attempt to extract JSON from the assistant's response
    let updatedResume = null;
    let textResponse = assistantResponse;

    // Use a regex to extract JSON from the response
    const jsonMatch = assistantResponse.match(/```json([\s\S]*?)```/);
    if (jsonMatch && jsonMatch[1]) {
      const jsonString = jsonMatch[1];
      updatedResume = JSON.parse(jsonString);
      textResponse = assistantResponse.replace(jsonMatch[0], '').trim();
    }

    // Emit the assistant's response text
    socket.emit(`${eventName}_done`, { content: textResponse });

    // Update conversation history with assistant's reply
    if (updateConversationHistory) {
      updateConversationHistory({ role: 'assistant', content: assistantResponse });
    }

    // If there's updated resume data, update it
    if (updatedResume) {
      userData[socket.id].resumeData = updatedResume;

      // Emit the updated resume to the client
      socket.emit('resume_updated', { resumeData: updatedResume });
    }
  } catch (error) {
    console.error('Error processing assistant response:', error);
    socket.emit(`${eventName}_error`, { error: 'Error processing assistant response.' });
  }
});


    response.data.on('error', (error) => {
      console.error('OpenAI API Stream Error:', error);
      socket.emit(`${eventName}_error`, { error: 'Error streaming data from OpenAI.' });
    });
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    socket.emit(`${eventName}_error`, { error: 'Error communicating with OpenAI API.' });
  }
};

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Initialize user data for this socket
  userData[socket.id] = {
    resumeData: null,
    conversationHistory: [],
  };

  // Handle resume upload and parsing
  socket.on('upload_resume', async (data) => {
    const { rawResumeText } = data;
    if (!rawResumeText) {
      socket.emit('upload_resume_error', { error: 'No resume text provided.' });
      return;
    }

    const prompt = `
    You are a helpful assistant that organizes resumes. Here is the raw text of a user's resume:

    ${rawResumeText}

    Parse the resume into a structured JSON format with the following sections:
    - Name
    - Contact Information
    - Summary
    - Skills
    - Work Experience
    - Education
    - Projects (if available)

    Ensure the JSON format matches the following structure:

    {
      "Name": "John Doe",
      "Contact Information": "john.doe@example.com | 123-456-7890 | LinkedIn: linkedin.com/in/johndoe",
      "Summary": "Short professional summary.",
      "Skills": ["Skill 1", "Skill 2", "Skill 3"],
      "Work Experience": [
        {
          "Position": "Job Title",
          "Company": "Company Name",
          "Dates": "Start Date - End Date",
          "Description": "Responsibilities or achievements."
        }
      ],
      "Education": [
        {
          "Degree": "Degree Name",
          "Institution": "School Name",
          "Dates": "Start Date - End Date"
        }
      ]
    }

    Only output the JSON. Do not include additional explanations or text.
  `;

    // Call OpenAI to parse the resume
    try {
      const messages = [
        { role: 'system', content: 'You are a helpful assistant that organizes resumes and provides additional recommendations based on the users current resume and the field or job they want to pursue' },
        { role: 'user', content: prompt },
      ];

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: messages,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const parsedResume = JSON.parse(response.data.choices[0].message.content);

      // Store the parsed resume in userData
      userData[socket.id].resumeData = parsedResume;

      socket.emit('upload_resume_done', { content: parsedResume });
    } catch (error) {
      console.error('Error parsing resume:', error.response?.data || error.message);
      socket.emit('upload_resume_error', { error: 'Error parsing resume.' });
    }
  });

  // Handle user messages
  socket.on('user_message', async (data) => {
    const { message } = data;
    if (!message) {
      socket.emit('user_message_error', { error: 'No message provided.' });
      return;
    }

    // Build conversation context
    const messages = [
      {
        role: 'system',
        content:
         `You are a helpful assistant that can discuss and edit the user's resume. Use the resume data provided to answer questions and make suggestions. 

When making changes to the resume, provide the updated resume data in JSON format enclosed within triple backticks like this:

\`\`\`json
{ "updatedResume": { ... } }
\`\`\`

Please ensure that the JSON is valid and parsable.`
      },
    ];

    // Include the resume data if available
    const resumeData = userData[socket.id].resumeData;
    if (resumeData) {
      messages.push({ role: 'system', content: `Here is the user's resume data: ${JSON.stringify(resumeData)}` });
    }

    // Add the conversation history
    const conversationHistory = userData[socket.id].conversationHistory;
    messages.push(...conversationHistory);

    // Add the user's new message
    messages.push({ role: 'user', content: message });

    // Update conversation history
    userData[socket.id].conversationHistory.push({ role: 'user', content: message });

    // Call OpenAI and pass a function to update the conversation history
    await callOpenAIStream(messages, socket, 'user_message_response', (assistantReply) => {
      userData[socket.id].conversationHistory.push(assistantReply);
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Clean up user data
    delete userData[socket.id];
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
