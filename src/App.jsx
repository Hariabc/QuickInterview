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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  QuickInterview.ai
                </h1>
              </div>
              
              {/* Navigation Tabs */}
              <nav className="flex space-x-8">
                <Link
                  to="/interviewee"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveTab('/interviewee')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Interviewee
                </Link>
                <Link
                  to="/interviewer"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveTab('/interviewer')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Interviewer Dashboard
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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