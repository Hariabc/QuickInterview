import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import IntervieweePage from './features/interview/IntervieweePage';
import InterviewerPage from './features/dashboard/InterviewerPage';
import database from './services/database';
import WelcomeBackModal from './components/WelcomeBackModal';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [unfinishedSessions, setUnfinishedSessions] = useState([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkForUnfinishedSessions();
  }, []);

  const checkForUnfinishedSessions = async () => {
    try {
      const sessions = await database.getUnfinishedSessions();
      if (sessions.length > 0) {
        setUnfinishedSessions(sessions);
        setShowWelcomeModal(true);
      }
    } catch (error) {
      console.error('Error checking for unfinished sessions:', error);
    }
  };

  const handleWelcomeModalClose = () => {
    setShowWelcomeModal(false);
  };

  const isActiveTab = (path) => {
    return location.pathname === path;
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/interviewee" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold">Q</div>
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">QuickInterview.ai</span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-2">
                <Link
                  to="/interviewee"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveTab('/interviewee')
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Interviewee
                </Link>
                <Link
                  to="/interviewer"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveTab('/interviewer')
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Interviewer Dashboard
                </Link>
              </nav>

              {/* Mobile Nav - compact links */}
              <nav className="md:hidden flex items-center gap-2">
                <Link
                  to="/interviewee"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActiveTab('/interviewee') ? 'bg-blue-600 text-white' : 'text-gray-700 bg-gray-100'
                  }`}
                >
                  Candidate
                </Link>
                <Link
                  to="/interviewer"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActiveTab('/interviewer') ? 'bg-blue-600 text-white' : 'text-gray-700 bg-gray-100'
                  }`}
                >
                  Admin
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<IntervieweePage />} />
            <Route path="/interviewee" element={<IntervieweePage />} />
            <Route path="/interviewer" element={<InterviewerPage />} />
          </Routes>
        </main>

        {/* Welcome Back Modal */}
        {showWelcomeModal && (
          <WelcomeBackModal
            sessions={unfinishedSessions}
            onClose={handleWelcomeModalClose}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;