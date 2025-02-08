# ResumePro Frontend

A React-based frontend for the ResumePro application, featuring real-time resume editing, AI chat integration, and dynamic template management.

## Table of Contents

- [Features](#features)
- [Components](#components)
- [State Management](#state-management)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Styling](#styling)

## Features

* **Interactive Resume Builder**
  * Real-time preview
  * Section-by-section editing
  * Template switching
  * AI-powered suggestions

* **AI Chat Interface**
  * Real-time communication with GPT-4
  * Contextual resume suggestions
  * Interactive editing through chat
  * Streaming responses

* **Resume Upload**
  * Drag-and-drop file upload
  * Multiple format support
  * Automatic parsing
  * Error handling

* **Template System**
  * Multiple professional templates
  * Live template switching
  * Customizable styling
  * Responsive design


## Components

### Resume Components

1. **ResumeBuilder**
   * Main container for resume creation
   * Manages sections and layout
   * Handles template switching

2. **ResumePreview**
   * Real-time preview of resume
   * PDF/DOCX export functionality
   * Responsive design

3. **SectionEditor**
   * Individual section editing
   * Form validation
   * Real-time updates

### Chat Components

1. **ChatInterface**
   * AI interaction container
   * Message history management
   * Real-time typing indicators

2. **MessageList**
   * Displays chat history
   * Message formatting
   * Auto-scrolling

3. **InputArea**
   * User input handling
   * File upload integration
   * Command processing

## State Management

### Context Structure

```javascript
// ResumeContext
const ResumeContext = {
  resumeData: {
    personalInfo: {},
    experience: [],
    education: [],
    skills: []
  },
  selectedTemplate: string,
  editMode: boolean,
  actions: {
    updateSection(),
    changeTemplate(),
    exportResume()
  }
}

// ChatContext
const ChatContext = {
  messages: [],
  isTyping: boolean,
  actions: {
    sendMessage(),
    processCommand(),
    updateResume()
  }
}
```

## Setup & Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```env
   VITE_BACKEND_URL=http://localhost:3001
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Usage

### Socket.IO Integration

```javascript
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_URL);

// Event listeners
socket.on('user_message_response_typing', handleTyping);
socket.on('user_message_response_done', handleResponse);
socket.on('preview_resume_done', handlePreview);
```

### Resume Operations

```javascript
// Upload resume
const handleUpload = async (file) => {
  const text = await file.text();
  socket.emit('upload_resume', { rawResumeText: text });
};

// Update section
const updateSection = (section, data) => {
  socket.emit('update_field', { field: section, value: data });
};
```

## API Integration

### Socket Events

1. **Emitting Events**
   * `user_message`: Send chat messages
   * `upload_resume`: Upload resume file
   * `update_field`: Update resume fields
   * `download_resume`: Request resume download

2. **Listening Events**
   * `user_message_response_typing`: Real-time AI response
   * `user_message_response_done`: Completed AI response
   * `preview_resume_done`: Resume preview update
   * `field_updated`: Field update confirmation

## Styling

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#10B981'
      }
    }
  },
  plugins: []
}
```

### Template System

Templates are styled using Tailwind CSS classes and can be customized through the TemplateSelector component.

## Development Guidelines

1. **Component Creation**
   * Use functional components
   * Implement proper prop-types
   * Follow atomic design principles

2. **State Management**
   * Use context for global state
   * Implement custom hooks
   * Keep components pure

3. **Code Style**
   * Follow ESLint configuration
   * Use Prettier for formatting
   * Write JSDoc comments

## Error Handling

```javascript
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <ErrorDisplay />;
  }

  return children;
};
```

## Testing

```bash
# Run tests
npm run dev

```

## Performance Optimization

* Implement React.memo for pure components
* Use lazy loading for templates
* Optimize socket connections
* Implement proper cleanup in useEffect

## Browser Support

* Chrome (latest)
* Firefox (latest)
* Safari (latest)
* Edge (latest)

## Contributing

1. Follow the coding style guide
2. Write unit tests for new features
3. Update documentation
4. Create detailed PR descriptions

## Troubleshooting

Common issues and solutions:
* Socket connection issues
* Template rendering problems
* State management conflicts
* File upload errors

## License

MIT License - see LICENSE.md