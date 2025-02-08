# ResumePro Backend

A Node.js backend server for a real-time resume builder application that uses Socket.IO for bidirectional communication and OpenAI's GPT-4 for intelligent resume processing and validation.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Required Dependencies](#required-dependencies)
- [API Endpoints](#api-endpoints)
- [Socket.IO Events](#socketio-events)
- [Resume Data Structure](#resume-data-structure)
- [GPT-4 Integration](#gpt-4-integration)
- [Error Handling](#error-handling)
- [Development](#development)
- [Security Considerations](#security-considerations)
- [Usage with Frontend](#usage-with-frontend)
- [Error Codes and Troubleshooting](#error-codes-and-troubleshooting)
- [Production Considerations](#production-considerations)

## Features

* Real-time communication using Socket.IO
* Resume parsing and validation with GPT-4
* Missing field detection and interactive completion
* Resume preview generation
* Real-time resume updates
* File upload support
* Structured JSON resume format
* Error handling and validation

## Prerequisites

* Node.js (v12 or higher)
* npm or yarn
* OpenAI API key
* Frontend application running on port 5173 (configurable)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=3001
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Required Dependencies

```json
{
  "dotenv": "for environment variables",
  "express": "for HTTP server",
  "axios": "for API calls",
  "cors": "for cross-origin resource sharing",
  "socket.io": "for real-time communication"
}
```

## API Endpoints

### POST /format-resume
* Validates and formats resume data
* Detects missing fields
* Returns formatted resume data or missing field errors

## Socket.IO Events

### Server Events (Listening)

1. `connection`
   * Initializes user data storage
   * Sets up event listeners

2. `check_resume_fields`
   * Validates resume data
   * Identifies missing fields
   * Uses GPT-4 for intelligent field validation

3. `preview_resume`
   * Generates resume preview
   * Handles missing field completion interactively

4. `upload_resume`
   * Processes raw resume text
   * Parses into structured JSON format using GPT-4

5. `user_message`
   * Handles user chat messages
   * Maintains conversation history
   * Processes requests through GPT-4

6. `download_resume`
   * Sends current resume data to client

7. `update_field`
   * Updates specific resume fields
   * Maintains data consistency

8. `disconnect`
   * Cleans up user data on disconnection

### Server Events (Emitting)

1. `missing_fields`
   * Sends list of missing fields to client

2. `resume_complete`
   * Confirms resume completion

3. `preview_resume_done`
   * Sends processed resume preview

4. `upload_resume_done`
   * Confirms successful resume upload
   * Returns parsed resume data

5. `user_message_response_typing`
   * Streams GPT-4 response in real-time

6. `user_message_response_done`
   * Sends completed GPT-4 response

7. Various error events (`*_error`)
   * Communicates specific error scenarios to client

## Resume Data Structure

```json
{
  "Name": "string",
  "Title": "string",
  "Location": "string",
  "Email": "string",
  "Phone": "string",
  "Summary": "string",
  "Experience": [
    {
      "Position": "string",
      "Company": "string",
      "Dates": "string",
      "Description": "string"
    }
  ],
  "Education": [
    {
      "Degree": "string",
      "Field": "string",
      "Institution": "string",
      "Dates": "string"
    }
  ]
}
```

## GPT-4 Integration

The server uses OpenAI's GPT-4 model for:
* Parsing raw resume text
* Validating resume fields
* Suggesting improvements
* Interactive resume building
* Real-time chat assistance

## Error Handling

The server implements comprehensive error handling for:
* API communication errors
* JSON parsing errors
* Missing or invalid data
* Stream processing errors
* Socket connection issues

## Development

The server runs on port 3001 by default and expects a frontend application running on port 5173. These ports can be configured through environment variables and CORS settings.

## Security Considerations

* CORS is configured for specific origin
* Environment variables for sensitive data
* Input validation before processing
* Error message sanitization

## Usage with Frontend

The frontend should establish a Socket.IO connection and listen for the appropriate events. Example connection:

```javascript
const socket = io('http://localhost:3001');

socket.on('connect', () => {
  console.log('Connected to server');
});
```

## Error Codes and Troubleshooting

Common error scenarios and their solutions:
1. OpenAI API errors: Check API key and request format
2. Socket connection issues: Verify CORS settings and ports
3. Parse errors: Validate input data format
4. Stream errors: Check network connectivity and timeout settings

## Production Considerations

Before deploying to production:
1. Set appropriate CORS origins
2. Configure error logging
3. Set up monitoring
4. Implement rate limiting
5. Add authentication
6. Configure SSL/TLS