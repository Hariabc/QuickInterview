# 🚀 QuickInterview.ai

<div align="center">

![QuickInterview.ai Logo](https://img.shields.io/badge/QuickInterview.ai-AI%20Interview%20Assistant-blue?style=for-the-badge&logo=react)

**A comprehensive AI-powered interview platform with resume parsing, real-time scoring, and cross-tab synchronization**

[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-purple?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.6-blue?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Live Demo](#) • [Documentation](#documentation) • [API Reference](#api-reference) • [Contributing](#contributing)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📖 Documentation](#-documentation)
- [🏗️ Architecture](#️-architecture)
- [🔧 Configuration](#-configuration)
- [📱 Usage](#-usage)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🎯 Core Functionality

- **🤖 AI-Powered Interviews**: Groq API integration with Llama 3.1 8B model for intelligent question generation and scoring
- **📄 Resume Parsing**: Automatic extraction of name, email, phone, and technical skills from PDF/DOCX files
- **⏱️ Timed Interview System**: 6 questions with progressive difficulty (Easy: 20s, Medium: 60s, Hard: 120s)
- **🔄 Real-time Cross-Tab Sync**: BroadcastChannel API for live updates between multiple browser tabs
- **💾 Data Persistence**: IndexedDB storage for candidates, chat history, and interview sessions
- **🔄 Session Recovery**: Automatic recovery for interrupted interviews

### 👤 Interviewee Experience

- **📤 Resume Upload**: Drag-and-drop interface with validation and parsing
- **📝 Missing Field Collection**: Smart prompts for incomplete information
- **⏰ Real-time Timer**: Visual countdown with auto-submit functionality
- **💬 Interactive Chat**: Question-by-question progression with immediate feedback
- **📊 Detailed Results**: Comprehensive scoring with strengths and improvement areas
- **🔄 Session Continuity**: Resume interrupted interviews seamlessly

### 📊 Interviewer Dashboard

- **👥 Candidate Management**: Search, sort, and filter candidate database
- **📈 Performance Analytics**: Real-time statistics and performance metrics
- **💬 Chat History**: Complete interview conversation logs
- **🤖 AI Insights**: Automated summaries and candidate analysis
- **🔄 Live Updates**: Real-time synchronization across multiple tabs
- **📊 Detailed Reports**: Question-by-question breakdown with scores

### 🎨 User Interface

- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🎨 Modern UI**: Clean, professional interface with TailwindCSS
- **♿ Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **🌙 Dark Mode**: Optional dark theme support
- **⚡ Performance**: Optimized loading with skeleton components and lazy loading

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing

### Backend Services
- **Groq API** - AI-powered question generation and scoring
- **IndexedDB** - Client-side database with idb wrapper
- **BroadcastChannel API** - Cross-tab communication

### File Processing
- **pdfjs-dist** - PDF parsing and text extraction
- **mammoth** - DOCX file processing

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16.0 or higher
- **npm** 7.0 or higher
- **Groq API Key** (optional, fallback questions available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/QuickInterview.git
   cd QuickInterview
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Groq API key:
   ```env
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

---

## 📖 Documentation

### Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Button.jsx       # Customizable button component
│   ├── Input.jsx        # Form input with validation
│   ├── Modal.jsx        # Modal dialog component
│   ├── ErrorBoundary.jsx # Error handling component
│   ├── Skeleton.jsx     # Loading skeleton components
│   └── WelcomeBackModal.jsx # Session recovery modal
├── features/
│   ├── interview/       # Interviewee functionality
│   │   ├── IntervieweePage.jsx    # Main interview page
│   │   ├── ResumeUpload.jsx       # Resume upload component
│   │   ├── InterviewChat.jsx      # Chat interface
│   │   ├── ChatMessage.jsx       # Individual message component
│   │   ├── TimerDisplay.jsx      # Timer visualization
│   │   ├── ProgressBar.jsx       # Progress indicator
│   │   └── InterviewSummary.jsx  # Results summary
│   └── dashboard/       # Interviewer functionality
│       ├── InterviewerPage.jsx    # Main dashboard page
│       ├── CandidateList.jsx     # Candidate table
│       └── CandidateDetails.jsx  # Individual candidate view
├── services/           # External services and APIs
│   ├── database.js     # IndexedDB operations
│   ├── broadcastChannel.js  # Cross-tab communication
│   └── aiService.js    # AI integration and scoring
├── utils/              # Utility functions
│   ├── resumeParser.js # Resume parsing logic
│   ├── timer.js        # Timer utilities
│   └── helpers.js      # General helper functions
├── App.jsx             # Main application component
└── main.jsx           # Application entry point
```

### API Reference

#### AI Service (`aiService.js`)

```javascript
// Generate interview questions
const questions = await aiService.generateInterviewQuestions(resumeText);

// Score an answer
const score = await aiService.scoreAnswer(question, answer);

// Generate final summary
const summary = aiService.generateFinalSummary({ candidate, questions, scores });
```

#### Database Service (`database.js`)

```javascript
// Candidate operations
await database.addCandidate(candidateData);
const candidate = await database.getCandidate(id);
const allCandidates = await database.getAllCandidates();

// Chat message operations
await database.addChatMessage(messageData);
const messages = await database.getChatMessages(candidateId);

// Session operations
await database.addInterviewSession(sessionData);
const session = await database.getInterviewSession(candidateId);
```

#### Resume Parser (`resumeParser.js`)

```javascript
// Parse resume file
const info = await resumeParser.parseResume(file);

// Get missing fields
const missing = resumeParser.getMissingFields(parsedInfo);

// Validate field
const isValid = resumeParser.validateField('email', 'user@example.com');
```

---

## 🏗️ Architecture

### Application Flow

```mermaid
graph TD
    A[User Uploads Resume] --> B[Resume Parser Extracts Info]
    B --> C[AI Generates Questions]
    C --> D[Interview Starts]
    D --> E[User Answers Questions]
    E --> F[AI Scores Each Answer]
    F --> G[Real-time Feedback]
    G --> H{More Questions?}
    H -->|Yes| E
    H -->|No| I[Generate Final Summary]
    I --> J[Save to Database]
    J --> K[Display Results]
```

### Data Flow

```mermaid
graph LR
    A[Frontend Components] --> B[Services Layer]
    B --> C[AI Service]
    B --> D[Database Service]
    B --> E[BroadcastChannel Service]
    C --> F[Groq API]
    D --> G[IndexedDB]
    E --> H[Cross-tab Sync]
```

### Component Hierarchy

```
App
├── ErrorBoundary
├── Header (Navigation)
├── Routes
│   ├── IntervieweePage
│   │   ├── ResumeUpload
│   │   ├── InterviewChat
│   │   └── InterviewSummary
│   └── InterviewerPage
│       ├── CandidateList
│       └── CandidateDetails
└── WelcomeBackModal
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Required: Groq API Configuration
VITE_GROQ_API_KEY=your_groq_api_key_here

# Optional: Application Configuration
VITE_APP_NAME=QuickInterview.ai
VITE_APP_VERSION=1.0.0
VITE_DEV_MODE=true
VITE_DEBUG_MODE=false

# Optional: Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_PWA=false
VITE_ENABLE_OFFLINE_MODE=false

# Optional: API Configuration
VITE_API_TIMEOUT=30000
VITE_MAX_RETRIES=3
VITE_RETRY_DELAY=1000

# Optional: File Upload Configuration
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=pdf,docx

# Optional: Interview Configuration
VITE_DEFAULT_QUESTION_COUNT=6
VITE_EASY_QUESTION_TIME=20
VITE_MEDIUM_QUESTION_TIME=60
VITE_HARD_QUESTION_TIME=120
```

### Customization

#### Styling
- Modify `tailwind.config.js` for custom colors and themes
- Update `src/index.css` for global styles
- Customize component styles in individual files

#### Interview Settings
- Adjust question counts and time limits in `aiService.js`
- Modify difficulty distribution in question generation
- Customize scoring criteria in fallback scoring

#### Database Schema
- Update `src/services/database.js` for schema changes
- Add new indexes for performance optimization
- Modify data validation rules

---

## 📱 Usage

### For Interviewees

1. **Start Interview**
   - Navigate to the Interviewee tab
   - Upload your resume (PDF or DOCX)
   - Complete any missing information if prompted

2. **Answer Questions**
   - Read each question carefully
   - Type your answer in the text area
   - Submit before time expires (auto-submit available)
   - Review AI feedback after each question

3. **View Results**
   - Review your overall score and rating
   - Read detailed feedback and suggestions
   - Download or print your results

### For Interviewers

1. **Access Dashboard**
   - Navigate to the Interviewer Dashboard tab
   - View real-time candidate statistics

2. **Manage Candidates**
   - Search candidates by name, email, or phone
   - Sort by score, name, or date
   - Click on candidates to view detailed profiles

3. **Review Interviews**
   - View complete chat history
   - Analyze AI-generated insights
   - Export candidate data for further analysis

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=aiService.test.js
```

### Test Structure

```
tests/
├── components/          # Component tests
├── services/           # Service tests
├── utils/              # Utility tests
└── integration/        # Integration tests
```

### Writing Tests

```javascript
// Example component test
import { render, screen } from '@testing-library/react';
import Button from '../src/components/Button';

test('renders button with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add VITE_GROQ_API_KEY
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Set environment variables in Netlify dashboard
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Run tests: `npm test`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Code Style

- Use ESLint configuration provided
- Follow React best practices
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Ensure all tests pass

### Reporting Issues

- Use GitHub Issues for bug reports
- Include steps to reproduce
- Provide environment details
- Add screenshots if applicable

---

## 📊 Performance

### Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Optimization

- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Regular bundle size monitoring

---

## 🔒 Security

### Data Protection

- **Client-side Storage**: All data stored locally in IndexedDB
- **No Server Dependencies**: No sensitive data transmitted
- **API Key Security**: Environment variables for API keys
- **Input Validation**: Comprehensive validation on all inputs

### Best Practices

- **HTTPS Only**: Secure connections required
- **Content Security Policy**: CSP headers implemented
- **XSS Protection**: Input sanitization and validation
- **CSRF Protection**: Same-origin policy enforcement

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Groq** for providing the AI API
- **React Team** for the amazing framework
- **TailwindCSS** for the utility-first CSS framework
- **Vite** for the fast build tool
- **Contributors** who help improve this project

---

## 📞 Support

- **Documentation**: [GitHub Wiki](https://github.com/yourusername/QuickInterview/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/QuickInterview/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/QuickInterview/discussions)
- **Email**: support@quickinterview.ai

---

<div align="center">

**Made with ❤️ by the QuickInterview.ai Team**

[⭐ Star this repo](https://github.com/yourusername/QuickInterview) • [🐛 Report Bug](https://github.com/yourusername/QuickInterview/issues) • [💡 Request Feature](https://github.com/yourusername/QuickInterview/issues)

</div>