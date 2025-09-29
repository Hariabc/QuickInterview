import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ResumeUpload from './ResumeUpload';
import InterviewChat from './InterviewChat';
import InterviewSummary from './InterviewSummary';
import database from '../../services/database';
import { generateId } from '../../utils/helpers';

const IntervieweePage = () => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState('upload'); // upload, interview, summary
  const [candidate, setCandidate] = useState(null);
  const [interviewSession, setInterviewSession] = useState(null);
  const [isResuming, setIsResuming] = useState(false);

  useEffect(() => {
    // Check if we're resuming an interview
    if (location.state?.resumeSession) {
      handleResumeInterview(location.state.resumeSession);
    }
  }, [location.state]);

  const handleResumeInterview = async (session) => {
    try {
      setIsResuming(true);
      const candidateData = await database.getCandidate(session.candidateId);
      
      setCandidate(candidateData);
      setInterviewSession(session);
      
      if (session.status === 'completed') {
        setCurrentStep('summary');
      } else {
        setCurrentStep('interview');
      }
    } catch (error) {
      console.error('Error resuming interview:', error);
    } finally {
      setIsResuming(false);
    }
  };

  const handleResumeUploaded = async (candidateData) => {
    try {
      // Save candidate to database
      const candidateId = await database.addCandidate(candidateData);
      const candidateWithId = { ...candidateData, id: candidateId };
      
      setCandidate(candidateWithId);
      setCurrentStep('interview');
      
      // Create new interview session
      const sessionId = await database.addInterviewSession({
        candidateId: candidateId,
        status: 'in_progress',
        currentQuestion: 0,
        totalQuestions: 6,
        startTime: new Date().toISOString(),
      });
      
      const session = { id: sessionId, candidateId, status: 'in_progress', currentQuestion: 0, totalQuestions: 6 };
      setInterviewSession(session);
      
    } catch (error) {
      console.error('Error saving candidate:', error);
    }
  };

  const handleInterviewComplete = async (summary) => {
    try {
      // Update candidate with final score
      await database.updateCandidate(candidate.id, {
        finalScore: summary.overallScore,
        interviewCompleted: true,
        completedAt: new Date().toISOString(),
      });
      
      // Update session status
      await database.updateInterviewSession(interviewSession.id, {
        status: 'completed',
        completedAt: new Date().toISOString(),
      });
      
      setInterviewSession({ ...interviewSession, status: 'completed' });
      setCurrentStep('summary');
      
    } catch (error) {
      console.error('Error completing interview:', error);
    }
  };

  const handleStartOver = () => {
    setCandidate(null);
    setInterviewSession(null);
    setCurrentStep('upload');
  };

  if (isResuming) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your interview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      {currentStep === 'upload' && (
        <ResumeUpload onResumeUploaded={handleResumeUploaded} />
      )}
      
      {currentStep === 'interview' && candidate && interviewSession && (
        <InterviewChat
          candidate={candidate}
          session={interviewSession}
          onComplete={handleInterviewComplete}
        />
      )}
      
      {currentStep === 'summary' && candidate && interviewSession && (
        <InterviewSummary
          candidate={candidate}
          session={interviewSession}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  );
};

export default IntervieweePage;
