
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import { useState, useEffect, useRef,startTransition } from 'react';

import React from 'react';
import HomeStyles from './HomeStyle.module.css';
import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import { Suspense } from 'react';

GlobalWorkerOptions.workerSrc = '/Users/abdulkanu/ResumePRO/ResumePro_Project/frontend/node_modules/pdfjs-dist/build/pdf.worker.min.mjs';
import { io } from 'socket.io-client';

import { AndyResume, NovelIstResume} from '../..';

import html2pdf from 'html2pdf.js';
import Modal from 'react-modal'; // If using react-modal
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles
// Adjust the import path based on where your templates.js file is located
import { templates } from '../../templates.js';




function ChatBot() {
    const [messages, setMessages] = useState([
        { message: "Hello! Upload your resume or ask me how to improve it.", sender: "ChatGPT", direction: "incoming" },
    ]);
    const [typing, setTyping] = useState(false);
    const [resumeData, setResumeData] = useState(null); // Store structured resume data
    const [resumeStyles, setResumeStyles] = useState({});
    const socketRef = useRef(null);
    //const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(templates[0]?.id || null);

    const [showTemplateSelector, setShowTemplateSelector] = useState(false);
    const [loading,setLoading] = useState(null)
    const resumePreviewRef = useRef(null); 
    



    //Modal.setAppElement('#root');




    useEffect(() => {
      // Establish WebSocket connection
      socketRef.current = io('http://localhost:3001');
  
      // Handle assistant responses
      socketRef.current.on('user_message_response_done', (data) => {
        setTyping(false);
        const assistantMessageContent = data.content;
      
        // Attempt to extract JSON code block
        const jsonMatch = assistantMessageContent.match(/```json([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) {
          try {
            const parsedJSON = JSON.parse(jsonMatch[1]);
      
            // Update resumeData with the parsed JSON
            setResumeData((prevData) => ({
              ...prevData,
              ...parsedJSON,
            }));

            
            console.log('Resume updated:', parsedJSON);
          } catch (error) {
            console.error('Error parsing assistant response JSON:', error);
          }
        } else {
          // Assistant is asking a question or providing a non-JSON response
          const assistantMessage = {
            message: assistantMessageContent,
            sender: 'ChatGPT',
            direction: 'incoming',
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }
      });
      
      
      // Handle typing indicator
      socketRef.current.on('user_message_response_typing', () => {
        setTyping(true);
      });
  
      // Handle errors
      socketRef.current.on('user_message_response_error', (data) => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            message: `Error: ${data.error || 'Unknown error'}`,
            sender: 'ChatGPT',
            direction: 'incoming',
          },
        ]);
      });

      socketRef.current.on('missing_fields', (data) => {
        const { missingFields } = data;
      
        for (const [field, question] of Object.entries(missingFields)) {
          const assistantMessage = {
            message: question,
            sender: 'ChatGPT',
            direction: 'incoming',
          };
          setMessages((prev) => [...prev, assistantMessage]);
      
          // Wait for user response through chat input
          socketRef.current.once('user_response', (response) => {
            socketRef.current.emit('update_field', { field, value: response });
          });
        }
      
        // Fetch updated resume after resolving all missing fields
        socketRef.current.emit('get_updated_resume');
      });
    
    socketRef.current.on('updated_resume', (data) => {
        setResumeData(data.resumeData);
        setShowTemplateSelector(true); // Show the template selector for preview
    });
    

      // socketRef.current.on('download_resume_data', (data) => {
      //   const { resumeData } = data;
      //   setResumeData(resumeData);
      //   console.log('Received resume data for download:', resumeData);
      //   //setShowModal(true); // Open the modal to display the resume
      //   setShowTemplateSelector(true);
      // });
  
      // Handle resume upload responses
      socketRef.current.on('upload_resume_done', (data) => {
        const formattedResume = data.resumeData;
        setResumeData(formattedResume); // Update resumeData with structured JSON
        console.log('Formatted Resume Data:', formattedResume); // Debug log
      });
      
      socketRef.current.on('upload_resume_error', (data) => {
        setTyping(false);
        alert(`Error uploading resume: ${data.error || 'Unknown error'}`);
      });
  
      // Handle content and style changes
      socketRef.current.on('content_changes', (data) => {
        const { contentChanges } = data;
        setResumeData((prevData) => ({
          ...prevData,
          ...contentChanges,
        }));
        console.log('Content changes applied:', contentChanges);
      });
  
      socketRef.current.on('style_changes', (data) => {
        const { styleChanges } = data;
        setResumeStyles((prevStyles) => ({
          ...prevStyles,
          ...styleChanges,
        }));
        console.log('Style changes applied:', styleChanges);
      });
  
      // Cleanup on component unmount
      return () => {
        socketRef.current.off('user_message_response_done');
        socketRef.current.off('user_message_response_typing');
        socketRef.current.off('user_message_response_error');
        socketRef.current.off('upload_resume_done');
        socketRef.current.off('upload_resume_error');
        socketRef.current.off('content_changes');
        socketRef.current.off('style_changes');
        socketRef.current.disconnect();
      };
    }, []);

    useEffect(() => {
      Promise.all(templates.map((template) => template.loader())).then(() => {
        console.log('All templates preloaded');
      });
    }, []);

    const fetchFormattedResume = async (uploadedResumeData) => {
      try {
          const response = await fetch("http://localhost:3001/format-resume", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(uploadedResumeData),
          });
  
          const data = await response.json();
          setResumeData(data.resumeData);
          console.log("Formatted Resume Data:", data.resumeData);
      } catch (error) {
          console.error("Error formatting resume:", error);
      }
  };

  const detectMissingFields = () => {
    const missingFields = Object.keys(resumeData || {}).reduce((acc, key) => {
        if (!resumeData[key]) {
            acc[key] = `Looks like I'm missing your ${key.toLowerCase()}. What is it?`;
        }
        return acc;
    }, {});

    return missingFields;
};

const previewResume = () => {
  if (!resumeData) {
    alert('No resume data available. Please upload or create a resume first.');
    return;
  }
  setLoading('previewing');

  // Directly show the template selector for preview
  setShowTemplateSelector(true);
  setLoading(null);
};


const handleMissingFields = async (missingFields) => {
  for (const [field, prompt] of Object.entries(missingFields)) {
      const userInput = prompt(prompt); // Ask user for missing field
      if (userInput) {
          setResumeData((prevData) => ({
              ...prevData,
              [field]: userInput,
          }));
      }
  }
};



  
      
      

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

    //setLoading("parsing");

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
          setLoading("parsing");
        });
      } else {
        alert("Unsupported file type. Please upload a PDF or plain text file.");
        setLoading(null);
        return;
      }
  
      // Send raw text to backend via WebSocket
      socketRef.current.emit('upload_resume', { rawResumeText: rawText });
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Failed to process the file. Please try again.");
    }
    finally{
      setLoading(null);
    }
  };
  
    const addSection = (sectionName, sectionData) => {
        setResumeData((prevData) => ({
            ...prevData,
            [sectionName]: sectionData,
        }));
    };

    // const handleDownloadClick = () => {
    //   setShowTemplateSelector(true);
    //   socketRef.current.emit('download_resume');
    // };

    const handleDownloadClick = () => {
      if (!resumeData) {
        alert('No resume data available to download.');
        return;
      }
      // Emit the 'download_resume' event to request resume data
      //socketRef.current.emit('download_resume');
    };
  
    const handleTemplateSelection = () => {
      if (selectedTemplate) {
        handleDownload();
        //setShowModal(false); // Close the modal after initiating download
        setShowTemplateSelector(false);
      } else {
        alert('Please select a template.');
      }
    };


    const handleDownload = () => {
      // Ensure the resume preview exists
      if (!resumePreviewRef.current) {
          alert('Resume preview is not available. Please preview your resume first.');
          return;
      }
  
      setLoading('downloading');
  
      // Use html2pdf to capture the resume and save it as a PDF
      html2pdf()
          .from(resumePreviewRef.current)
          .set({
              margin: 0.5, // Adjusted margin for better spacing
              filename: `${resumeData?.Name || 'Resume'}.pdf`, // Fallback to 'Resume' if Name is not provided
              image: { type: 'jpeg', quality: 0.98 }, // High-quality images
              html2canvas: { scale: 3, useCORS: true }, // Increased scale for better resolution
              jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
          })
          .save()
          .then(() => {
              console.log('Resume downloaded successfully!');
          })
          .catch((error) => {
              console.error('Error downloading resume:', error);
              alert('Failed to download the resume. Please try again.');
          })
          .finally(() => {
              setLoading(null); // Clear loading state after download
          });
  };
  
    
  
  const renderSelectedTemplate = () => {
    const selected = templates.find((t) => t.id === selectedTemplate);
    if (selected && selected.component) {
        const TemplateComponent = selected.component;
        return (
            <Suspense fallback={<div>Loading Template...</div>}>
            <div ref={resumePreviewRef}>
                    <TemplateComponent resumeData={resumeData} />
                </div>
            </Suspense>
        );
    }
    return null;
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
      
      const RenderContent = ({ content, section }) => {
        if (!content) return <span>Invalid Content</span>;
      
        // Handle arrays
        if (Array.isArray(content)) {
          return (
            <ul style={resumeStyles[section]}>
              {content.map((item, idx) => (
                <li key={idx}>
                  <RenderContent content={item} section={section} />
                </li>
              ))}
            </ul>
          );
        }
      
        // Handle objects
        if (typeof content === 'object' && content !== null) {
          return (
            <div>
              {Object.entries(content).map(([key, value]) => (
                <div key={key} style={resumeStyles[key] || {}}>
                  <strong>{key}:</strong>{" "}
                  <RenderContent content={value} section={key} />
                </div>
              ))}
            </div>
          );
        }
      
        // Handle strings or other primitive types
        return <span>{String(content)}</span>;
      };
      
    
      return (
        <div className={HomeStyles.parentContainer}>
            <h1>ResumePRO</h1>
            <div className={HomeStyles.container}>
                {/* Chat Section */}
                <div className={HomeStyles.chatSection}>
                    <MainContainer>
                        <ChatContainer>
                            <MessageList
                                typingIndicator={
                                    typing ? <TypingIndicator content="ResumePro is typing..." /> : null
                                }
                            >
                                {messages.map((message, i) => (
                                    <Message key={i} model={message} />
                                ))}
                            </MessageList>
                            <MessageInput
                                placeholder="Type a message..."
                                onSend={handleSend}
                                attachButton={false}
                            />
                        </ChatContainer>
                    </MainContainer>
                </div>
    
            {/* Resume Section */}
            <div className={HomeStyles.resumeSection}>
                <h2>Your Resume</h2>
                <div className={HomeStyles.loadingIndicator}>
                    {loading === 'parsing' && <p>Parsing your resume...</p>}
                    {loading === 'previewing' && <p>Loading preview...</p>}
                    {loading === 'downloading' && <p>Downloading your resume...</p>}
                </div>

                {!resumeData ? (
                    <>
                        <h3>Upload Your Resume</h3>
                        <input
                            type="file"
                            accept=".pdf, .txt"
                            onChange={handleFileUpload}
                            className={HomeStyles.uploadInput}
                        />
                        <p className={HomeStyles.noResumeText}>No resume uploaded yet.</p>
                    </>
                ) : (
                    <>
                        <button onClick={previewResume}>Preview Resume</button>
                        {showTemplateSelector ? (
                            <Suspense fallback={<div>Loading Template...</div>}>
                                <Carousel showThumbs={false} showStatus={false}>
                                    <div>
        <div ref={resumePreviewRef}>
            <NovelIstResume resumeData={resumeData} />
        </div>
        <button onClick={handleDownload} className={HomeStyles.downloadButton}>
                                                    Download Resume
                                                </button>
                                    </div>
                                    {/* Additional templates can be added here if needed */}
                                </Carousel>

                            </Suspense>
                        ) : (
                            <div className={HomeStyles.resumeContent}>
                                {Object.entries(resumeData).map(([section, content], index) => (
                                    <div
                                        key={index}
                                        style={resumeStyles[section]}
                                        className="resume-section"
                                    >
                                        <h3>{section}</h3>
                                        <RenderContent content={content} section={section} />
                                    </div>
                                ))}
                            </div>
                        )}
                  
                    </>
                )}
            </div>
            </div>
        </div>
    );
    
    }
    
    export default ChatBot;