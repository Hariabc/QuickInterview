# AI Interview Assistant

A comprehensive React application for conducting AI-powered interviews with resume parsing, timed questions, and real-time cross-tab synchronization.

## Features

### 🎯 Core Functionality
- **Resume Upload & Parsing**: Supports PDF and DOCX files with automatic extraction of name, email, and phone
- **Timed Interview System**: 6 questions with different time limits (Easy: 20s, Medium: 60s, Hard: 120s)
- **AI-Powered Scoring**: Mock AI service that generates questions and scores answers
- **Real-time Cross-Tab Sync**: Uses BroadcastChannel API for live updates between tabs
- **Data Persistence**: IndexedDB storage for candidates, chat history, and interview sessions

### 👤 Interviewee Experience
- Resume upload with parsing and validation
- Missing field collection before interview starts
- Real-time timer display with auto-submit
- Question-by-question progression
- Final score and detailed feedback
- Session recovery for interrupted interviews

### 📊 Interviewer Dashboard
- Candidate list with search and sorting
- Individual candidate profiles and chat history
- AI-generated summaries and insights
- Real-time updates from other tabs
- Performance metrics and analytics

## Tech Stack

- **Frontend**: React 18 with JSX
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **State Management**: React hooks (useState, useEffect)
- **Database**: IndexedDB with idb library
- **File Parsing**: pdfjs-dist (PDF), mammoth (DOCX)
- **Build Tool**: Vite

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd QuickInterview
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Button.jsx
│   ├── Modal.jsx
│   ├── Input.jsx
│   └── WelcomeBackModal.jsx
├── features/
│   ├── interview/       # Interviewee functionality
│   │   ├── IntervieweePage.jsx
│   │   ├── ResumeUpload.jsx
│   │   ├── InterviewChat.jsx
│   │   ├── ChatMessage.jsx
│   │   ├── TimerDisplay.jsx
│   │   ├── ProgressBar.jsx
│   │   └── InterviewSummary.jsx
│   └── dashboard/       # Interviewer functionality
│       ├── InterviewerPage.jsx
│       ├── CandidateList.jsx
│       └── CandidateDetails.jsx
├── services/           # External services and APIs
│   ├── database.js     # IndexedDB operations
│   ├── broadcastChannel.js  # Cross-tab communication
│   └── aiService.js    # Mock AI functions
├── utils/              # Utility functions
│   ├── resumeParser.js # Resume parsing logic
│   ├── timer.js        # Timer utilities
│   └── helpers.js      # General helpers
├── App.jsx             # Main application component
└── main.jsx           # Application entry point
```

## Usage

### For Interviewees
1. Navigate to the Interviewee tab
2. Upload your resume (PDF or DOCX)
3. Complete any missing information if prompted
4. Answer 6 interview questions within the time limits
5. Review your final score and feedback

### For Interviewers
1. Navigate to the Interviewer Dashboard tab
2. View the list of all candidates
3. Search and sort candidates by various criteria
4. Click on a candidate to view detailed profile and chat history
5. Monitor real-time updates from ongoing interviews

## Key Features Explained

### Resume Parsing
- Automatically extracts name, email, and phone from uploaded resumes
- Supports both PDF and DOCX formats
- Prompts for missing information before starting interview

### Timed Interview System
- 6 questions total: 2 Easy (20s), 2 Medium (60s), 2 Hard (120s)
- Visual timer with progress indicators
- Auto-submit when time expires
- Real-time countdown display

### Cross-Tab Synchronization
- Uses BroadcastChannel API for real-time communication
- Updates candidate lists instantly across multiple tabs
- Synchronizes interview progress between interviewee and interviewer views

### Data Persistence
- All data stored locally using IndexedDB
- Survives browser refreshes and tab closures
- Automatic session recovery for interrupted interviews

### AI Scoring System
- Mock AI service generates contextual questions
- Scores answers based on keyword matching and content analysis
- Provides detailed feedback for each question
- Generates comprehensive final summaries

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features
1. Create components in appropriate feature directories
2. Add services for external integrations
3. Update database schema in `src/services/database.js`
4. Add new message types to `src/services/broadcastChannel.js`

## Browser Support
- Modern browsers with IndexedDB support
- Chrome, Firefox, Safari, Edge (latest versions)
- BroadcastChannel API support required for cross-tab sync

## License
MIT License - see LICENSE file for details

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Note**: This application uses mock AI services for demonstration purposes. In a production environment, you would integrate with actual AI services for question generation and answer scoring.