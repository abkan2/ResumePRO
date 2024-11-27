
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import HomeStyles from './HomeStyle.module.css';
import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = '/Users/abdulkanu/ResumePRO/ResumePro_Project/frontend/node_modules/pdfjs-dist/build/pdf.worker.min.mjs';
import { io } from 'socket.io-client';



function ChatBot() {
    const [messages, setMessages] = useState([
        { message: "Hello! Upload your resume or ask me how to improve it.", sender: "ChatGPT", direction: "incoming" },
    ]);
    const [typing, setTyping] = useState(false);
    const [resumeData, setResumeData] = useState(null); // Store structured resume data
    const socketRef = useRef(null);

    useEffect(() => {
        // Establish WebSocket connection
        socketRef.current = io('http://localhost:3001');
      
        // Handle assistant responses
        socketRef.current.on('user_message_response_done', (data) => {
          setTyping(false);
          const assistantMessage = { message: data.content, sender: 'ChatGPT', direction: 'incoming' };
          setMessages((prev) => [...prev, assistantMessage]);
        });
      
        // Handle typing indicator
        socketRef.current.on('user_message_response_typing', () => {
          setTyping(true);
        });

        socketRef.current.on('resume_parsed', (data) => {
            const { resumeData } = data;
            setResumeData(resumeData); // Update state with the parsed resume data
          });
      
        // Handle errors
        socketRef.current.on('user_message_response_error', (data) => {
          setTyping(false);
          setMessages((prev) => [
            ...prev,
            { message: `Error: ${data.error || 'Unknown error'}`, sender: 'ChatGPT', direction: 'incoming' },
          ]);
        });

        socketRef.current.on('resume_updated', (data) => {
            const updatedResumeData = data.resumeData;
            setResumeData(updatedResumeData); // Update resumeData state
            console.log('Resume updated:', updatedResumeData);
          });
      
        // Handle resume upload responses
        socketRef.current.on('upload_resume_done', (data) => {
          const formattedResume = data.content;
          setResumeData(JSON.parse(formattedResume)); // Update resumeData with structured JSON
          console.log("Formatted Resume Data:", formattedResume); // Debug log
        });
      
        socketRef.current.on('upload_resume_error', (data) => {
          setTyping(false);
          alert(`Error uploading resume: ${data.error || 'Unknown error'}`);
        });
      
        // Cleanup on component unmount
        return () => {
            socketRef.current.off('resume_updated');
          socketRef.current.disconnect();

        };
      }, []);
      
      

    // Extract Raw Text from PDF
    const extractPdfText = async (file) => {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = async (event) => {
                try {
                    const typedArray = new Uint8Array(event.target.result);
                    const pdf = await pdfjsLib.getDocument(typedArray).promise;

                    let text = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        text += content.items.map(item => item.str).join(' ') + '\n';
                    }
                    resolve(text);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });
    };

// Handle Resume Upload

const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("No file selected. Please upload a valid resume.");
      return;
    }
  
    try {
      let rawText = "";
  
      // Extract text from file
      if (file.type === "application/pdf") {
        rawText = await extractPdfText(file); // Extract raw text from PDF
      } else if (file.type === "text/plain" || file.type === "text/markdown") {
        rawText = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.onerror = (error) => reject(error);
          reader.readAsText(file);
        });
      } else {
        alert("Unsupported file type. Please upload a PDF or plain text file.");
        return;
      }
  
      // Send raw text to backend via WebSocket
      socketRef.current.emit('upload_resume', { rawResumeText: rawText });
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Failed to process the file. Please try again.");
    }
  };
  
    const addSection = (sectionName, sectionData) => {
        setResumeData((prevData) => ({
            ...prevData,
            [sectionName]: sectionData,
        }));
    };
    
    

    // Handle Chat Input
    const handleSend = (message) => {
        // Create a new message object and update the messages state
        const newMessage = { message, sender: 'user', direction: 'outgoing' };
        setMessages((prev) => [...prev, newMessage]);
      
        // Indicate that the assistant is typing
        setTyping(true);
      
        // Emit the message via WebSocket
        socketRef.current.emit('user_message', {
          message: message, // The user's message or request
        });
      
        // No need to handle try/catch here as we're not awaiting anything
        // Responses and errors will be handled via WebSocket events
      };
      
    
    
    return (
        <div className={HomeStyles.parentContainer}>
            <h1>ResumePRO</h1>
            <div className={HomeStyles.container}>
                <div className={HomeStyles.chatSection}>
                
                    <MainContainer>
                        <ChatContainer>
                            <MessageList typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing..." /> : null}>
                                {messages.map((message, i) => (
                                    <Message key={i} model={message} />
                                ))}
                            </MessageList>
                            <MessageInput placeholder="Type a message..." onSend={handleSend} />
                        </ChatContainer>
                    </MainContainer>
                </div>
                <div className={HomeStyles.resumeSection}>
                    <h2>Upload Your Resume</h2>
                    <input type="file" accept=".pdf, .txt" onChange={handleFileUpload}/>
                    <h2>Your Resume</h2>
                    {resumeData ? (
  <div className="resume-container">
{Object.entries(resumeData).map(([section, content], index) => (
  <div key={index} className="resume-section">
    <h3 className="resume-section-title">{section}</h3>
    {/* Handle different content types */}
    {Array.isArray(content) ? (
      <ul className="resume-list">
        {content.map((item, idx) => (
          <li key={idx} className="resume-item">
            {typeof item === "object" ? (
              Object.entries(item).map(([key, value]) => (
                <p key={key} className="resume-detail">
                  <strong>{key}:</strong> {value}
                </p>
              ))
            ) : (
              item
            )}
          </li>
        ))}
      </ul>
    ) : typeof content === "object" ? (
      // Render object content explicitly
      <div>
        {Object.entries(content).map(([key, value]) => (
          <p key={key} className="resume-detail">
            <strong>{key}:</strong> {value}
          </p>
        ))}
      </div>
    ) : (
      <p className="resume-summary">{content}</p>
    )}
  </div>
    ))}
  </div>
) : (
  <p className={HomeStyles.NoResume}>No resume uploaded yet.</p>
)}




                </div>
            </div>
        </div>
    );
}

export default ChatBot;
