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
    origin: 'http://localhost:5173', // Adjust this to match your frontend origin
    methods: ['GET', 'POST'],
  },
});

// Store user data (resume and conversation history) per socket connection
const userData = {};

const callGPTForMissingFields = async (resumeData) => {
  const prompt = `
You are a helpful resume assistant. Validate and improve the following resume data:
1. If any field appears to be missing but can be derived or inferred from other fields, assign it appropriately. For example:
   - "Tagline" could be derived from "Summary" or "Title".
   - Ambiguous fields like "Location" should be validated based on context.
2. If a field cannot be resolved, return a JSON object where:
   - The key is the missing or unresolved field.
   - The value is a question to ask the user for clarification.

Here is the user's resume data:
${JSON.stringify(resumeData, null, 2)}

Respond only with a JSON object. Include:
1. "resolvedData": The updated resume data with any inferred fields filled in.
2. "missingFields": A list of unresolved fields with questions for the user.

Example response:
{
  "resolvedData": { ...updated resume... },
  "missingFields": {
    "Tagline": "What is your tagline or professional slogan?",
    "Phone": "What is your phone number?"
  }
}
`;

  try {
      const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
              model: 'gpt-4',
              messages: [{ role: 'system', content: prompt }],
              temperature: 0,
          },
          {
              headers: {
                  Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                  'Content-Type': 'application/json',
              },
          }
      );

      const result = JSON.parse(response.data.choices[0].message.content);
      return result;
  } catch (error) {
      console.error('Error calling GPT:', error);
      throw new Error('Failed to process resume data.');
  }
};


app.post('/format-resume', (req, res) => {
  const resumeData = req.body;

  // Detect missing fields dynamically
  const missingFields = Object.entries(resumeData).reduce((acc, [key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
          acc[key] = `Looks like I'm missing your ${key}. What is it?`;
      }
      return acc;
  }, {});

  if (Object.keys(missingFields).length > 0) {
      return res.status(400).json({ missingFields });
  }

  // Format the resume data and return
  const formattedData = {
      ...resumeData,
      Name: resumeData.Name || "Your Name",
      Title: resumeData.Title || "Your Title",
      Location: resumeData.Location || "Your Location",
      Email: resumeData.Email || "your.email@example.com",
      Phone: resumeData.Phone || "123-456-7890",
      Summary: resumeData.Summary || "A brief professional summary goes here.",
  };

  res.json({ resumeData: formattedData });
});





// Consolidated Dynamic Prompt
// const getSystemPrompt = (resumeData) => `
// You are a helpful resume assistant. Based on the user's input, decide the appropriate action:

// 1. If the user uploads or provides raw resume text, parse it into a structured JSON format with sections like "Name", "Contact Information", "Skills", "Experience", "Education", etc.
// 2. If the user references an existing resume, modify the JSON resume based on their request and output the updated JSON.
//    - **This includes adding, removing, or rearranging sections or content within the resume.**
//    - **For example, if the user wants to move the "Skills" section towards the bottom, adjust the JSON structure accordingly and output the updated JSON.**
// 3. If the user wants to build a resume from scratch, interactively collect the necessary information by asking one question at a time. Once all the required information is gathered, output the complete resume in JSON format enclosed in triple backticks (\`\`\`json ... \`\`\`).

// **Guidelines:**

// - Always return JSON enclosed in triple backticks when providing or updating the resume.
// - Do not include any explanations or extra text outside the JSON when returning resume data.
// - For non-JSON responses, communicate naturally and guide the user through the resume creation process.
// - If you need more information, ask the user specific questions.
// - **When modifying the resume, ensure that the JSON structure reflects the requested changes, including any rearrangements of sections or content.**

// Here is the user's current resume (if available):

// \`\`\`json
// ${JSON.stringify(resumeData || {}, null, 2)}
// \`\`\`
// `;

const getSystemPrompt = (resumeData) => `
You are a helpful resume assistant. Based on the user's input, output the resume in the following JSON format:

\`\`\`json
{
  "Name": "",
  "Title": "",
  "Location": "",
  "Email": "",
  "Phone": "",
  "Summary": "",
  "Experience": [
    {
      "Position": "",
      "Company": "",
      "Dates": "",
      "Description": ""
    }
    // More experience entries
  ],
  "Education": [
    {
      "Degree": "",
      "Field": "",
      "Institution": "",
      "Dates": ""
    }
    // More education entries
  ],
  // Additional sections as needed
}
\`\`\`

**Guidelines:**

- Always return the resume in the above JSON format.
- Do not include any explanations or extra text outside the JSON.
- If the user provides new information or requests changes, update the JSON accordingly.
- If information is missing, you can ask the user specific questions to obtain it.

Here is the user's current resume (if available):

\`\`\`json
${JSON.stringify(resumeData || {}, null, 2)}
\`\`\`
`;



// OpenAI API Call Function with Streaming

const callOpenAIStream = async (messages, socket, eventName) => {
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
      timeout: 10000,
    });

    let buffer = ''; // Buffer to accumulate incomplete data
    let fullResponse = ''; // Accumulates the full assistant response

    response.data.on('data', (chunk) => {
      buffer += chunk.toString();

      const lines = buffer.split('\n');
      buffer = lines.pop(); // Save incomplete line for next chunk

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const json = line.slice(6); // Remove 'data: '
          if (json === '[DONE]') return;

          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices[0].delta.content;

            if (content) {
              fullResponse += content;
              socket.emit(`${eventName}_typing`, { content });
            }
          } catch (error) {
            console.error('Error parsing OpenAI stream chunk:', error);
          }
        }
      }
    });

    response.data.on('end', () => {
      const assistantResponse = fullResponse.trim();

      // Emit the assistant's full response to the client
      socket.emit(`${eventName}_done`, { content: assistantResponse });
    });

    response.data.on('error', (error) => {
      console.error('Stream error:', error);
      socket.emit(`${eventName}_error`, { error: 'Error processing your request.' });
    });
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    socket.emit(`${eventName}_error`, { error: 'Failed to communicate with OpenAI.' });
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

  socket.on('check_resume_fields', async (data) => {
    try {
        const { resumeData } = data;

        // Call GPT to validate and improve resume data
        const { resolvedData, missingFields } = await callGPTForMissingFields(resumeData);

        if (Object.keys(missingFields).length > 0) {
            // Send missing fields back to the client for clarification
            socket.emit('missing_fields', { missingFields });
        } else {
            // If no missing fields, confirm resume is complete
            socket.emit('resume_complete', { resumeData: resolvedData });
        }

        // Save updated resume data on the server
        userData[socket.id].resumeData = resolvedData;
    } catch (error) {
        console.error('Error checking resume fields:', error);
        socket.emit('error', { message: 'Failed to check resume fields.' });
    }
});

socket.on('preview_resume', async (data) => {
  try {
    // Fetch the user's resume data
    const currentResumeData = userData[socket.id]?.resumeData || {};

    // Call GPT to validate and improve the resume data
    const { resolvedData, missingFields } = await callGPTForMissingFields(currentResumeData);

    // Update the resolved data
    userData[socket.id].resumeData = resolvedData;

    if (Object.keys(missingFields).length > 0) {
      // Ask user for missing fields through the chat interface
      for (const [field, question] of Object.entries(missingFields)) {
        socket.emit('user_message_response_done', {
          content: question,
        });

        // Listen for user response
        await new Promise((resolve) => {
          socket.once('user_response', (value) => {
            // Update the missing field in resume data
            userData[socket.id].resumeData[field] = value;
            resolve();
          });
        });
      }
    }

    // Once all missing fields are filled, send the updated data back
    socket.emit('preview_resume_done', {
      resumeData: userData[socket.id].resumeData,
    });
  } catch (error) {
    console.error('Error during resume preview:', error.message);
    socket.emit('preview_resume_error', { error: 'Failed to preview resume.' });
  }
});


  socket.on('upload_resume', async (data) => {
    const { rawResumeText } = data;
    if (!rawResumeText) {
      socket.emit('upload_resume_error', { error: 'No resume text provided.' });
      return;
    }
  
    // Create a system prompt to parse the resume
    const systemPrompt = `
  You are a helpful resume assistant. Parse the following resume text into structured JSON format with sections like "Name", "Contact Information", "Skills", "Experience", "Education", etc.
  
  - **Important Instructions:**
    - **Return only the JSON object. Do not include any explanations or additional text.**
    - **Ensure the JSON is valid and properly formatted.**
    - **Do not include any code blocks or markdown formatting.**
  
  Resume Text:
  "${rawResumeText}"
  
  Return the JSON formatted resume.
  `;
  
    const messages = [
      { role: 'system', content: systemPrompt },
    ];
  
    try {
      // Call OpenAI API to parse the resume
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: messages,
          temperature: 0, // Set temperature to 0 for deterministic output
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const assistantMessage = response.data.choices[0].message.content;
  
      console.log('Assistant Response:', assistantMessage);
  
      // Attempt to parse the assistant's response directly
      const assistantResponseCleaned = assistantMessage.trim();
  
      try {
        const parsedJSON = JSON.parse(assistantResponseCleaned);
  
        // Store the resume data in userData
        userData[socket.id].resumeData = parsedJSON;
  
        // Emit the parsed resume data back to the client
        socket.emit('upload_resume_done', { resumeData: parsedJSON });
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        socket.emit('upload_resume_error', { error: 'Failed to parse resume JSON.' });
      }
    } catch (error) {
      console.error('Error parsing resume:', error);
  
      if (error.response) {
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
  
      socket.emit('upload_resume_error', { error: 'Failed to process resume.' });
    }
  });
  

  


  socket.on('user_message', async (data) => {
    const { message } = data;
    if (!message) {
      socket.emit('user_message_error', { error: 'No message provided.' });
      return;
    }





    const systemPrompt = getSystemPrompt(userData[socket.id].resumeData);

    const messages = [
      { role: 'system', content: systemPrompt },
      ...userData[socket.id].conversationHistory,
      { role: 'user', content: message },
    ];

    userData[socket.id].conversationHistory.push({ role: 'user', content: message });

    await callOpenAIStream(messages, socket, 'user_message_response');
  });


  socket.on('download_resume', () => {
    const resumeData = userData[socket.id]?.resumeData || {
        Name: "Your Name",
        Title: "Your Title",
        Location: "Your Location",
        Email: "your.email@example.com",
        Phone: "123-456-7890",
        Summary: "A brief professional summary goes here.",
        Experience: [],
        Education: [],
        Skills: [],
    };

    socket.emit('download_resume_data', { resumeData });
    console.log(`Sent resume data to client ${socket.id}`);
});

socket.on('update_field', (data) => {
  const { field, value } = data;
  // Update user data on the server
  userData[socket.id].resumeData[field] = value;

  // Acknowledge update
  socket.emit('field_updated', { field, value });
});

socket.on('get_updated_resume', () => {
  const updatedResume = userData[socket.id].resumeData;
  socket.emit('updated_resume', { resumeData: updatedResume });
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
