import React, { useState, useEffect, useRef } from 'react';
import { Timer, formatTime, getTimeRemainingText, getTimerColor } from '../../utils/timer';
import database from '../../services/database';
import aiService from '../../services/aiService';
import { calculateProgress } from '../../utils/helpers';
import Button from '../../components/Button';
import ChatMessage from './ChatMessage';
import TimerDisplay from './TimerDisplay';
import ProgressBar from './ProgressBar';

const InterviewChat = ({ candidate, session, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeInterview();
    return () => {
      if (timer) {
        timer.stop();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [answers]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeInterview = async () => {
    try {
      // Generate questions if not already generated
      let interviewQuestions = questions;
      if (questions.length === 0) {
        interviewQuestions = aiService.generateInterviewQuestions();
        setQuestions(interviewQuestions);
      }

      // Start with the first question
      if (interviewQuestions.length > 0) {
        await startQuestion(interviewQuestions[0], 0);
      }
    } catch (error) {
      console.error('Error initializing interview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startQuestion = async (question, index) => {
    setIsAnswerSubmitted(false);
    setCurrentAnswer('');
    
    // Create and start timer
    const newTimer = new Timer(
      question.timeLimit,
      (remainingTime) => {
        // Timer tick - could broadcast to other tabs here
      },
      () => {
        // Timer expired - auto-submit
        handleAutoSubmit();
      }
    );
    
    newTimer.start();
    setTimer(newTimer);

    // Save question start time
    await database.addChatMessage({
      candidateId: candidate.id,
      type: 'question',
      content: question.question,
      questionNumber: index + 1,
      difficulty: question.difficulty,
      timeLimit: question.timeLimit,
    });
  };

  const handleAnswerChange = (value) => {
    setCurrentAnswer(value);
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) return;
    
    await submitAnswer(currentAnswer);
  };

  const handleAutoSubmit = async () => {
    if (currentAnswer.trim()) {
      await submitAnswer(currentAnswer);
    } else {
      await submitAnswer('No answer provided (time expired)');
    }
  };

  const submitAnswer = async (answerText) => {
    if (isAnswerSubmitted) return;
    
    setIsAnswerSubmitted(true);
    
    // Stop timer
    if (timer) {
      timer.stop();
    }

    const currentQuestion = questions[currentQuestionIndex];
    const answerData = {
      question: currentQuestion,
      answer: answerText,
      difficulty: currentQuestion.difficulty,
      timeLimit: currentQuestion.timeLimit,
      timeSpent: currentQuestion.timeLimit - (timer ? timer.getRemainingTime() : 0),
    };

    // Score the answer
    const scoreData = aiService.scoreAnswer(currentQuestion, answerText);
    const scoredAnswer = { ...answerData, ...scoreData };

    // Save answer
    const newAnswers = [...answers, scoredAnswer];
    setAnswers(newAnswers);

    // Save to database
    await database.addChatMessage({
      candidateId: candidate.id,
      type: 'answer',
      content: answerText,
      questionNumber: currentQuestionIndex + 1,
      score: scoreData.score,
      feedback: scoreData.feedback,
    });

    // Move to next question or complete interview
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setTimeout(() => {
        setCurrentQuestionIndex(nextIndex);
        startQuestion(questions[nextIndex], nextIndex);
      }, 2000); // Brief pause to show feedback
    } else {
      // Interview complete
      await completeInterview(newAnswers);
    }
  };

  const completeInterview = async (finalAnswers) => {
    setIsInterviewComplete(true);
    
    // Update session status
    await database.updateInterviewSession(session.id, {
      status: 'completed',
      completedAt: new Date().toISOString(),
    });

    // Generate final summary
    const summary = aiService.generateFinalSummary({
      candidate,
      answers: finalAnswers,
      scores: finalAnswers,
    });

    // Save summary to database
    await database.addChatMessage({
      candidateId: candidate.id,
      type: 'summary',
      content: JSON.stringify(summary),
    });

    // Notify parent component
    setTimeout(() => {
      onComplete(summary);
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Preparing your interview...</p>
        </div>
      </div>
    );
  }

  if (isInterviewComplete) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Interview Complete!
        </h2>
        <p className="text-gray-600">
          Thank you for completing the interview. Generating your results...
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = calculateProgress(currentQuestionIndex, questions.length);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Interview in Progress
          </h2>
          <div className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
        
        <ProgressBar progress={progress} />
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(currentQuestion?.difficulty)}`}>
              {currentQuestion?.difficulty?.toUpperCase()}
            </span>
            <span className="text-sm text-gray-500">
              {getTimeRemainingText(timer?.getRemainingTime() || 0)}
            </span>
          </div>
          <TimerDisplay timer={timer} />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {answers.map((answer, index) => (
            <div key={index}>
              <ChatMessage
                type="question"
                content={answer.question.question}
                difficulty={answer.question.difficulty}
                questionNumber={index + 1}
              />
              <ChatMessage
                type="answer"
                content={answer.answer}
                score={answer.score}
                feedback={answer.feedback}
              />
            </div>
          ))}
          
          {currentQuestion && (
            <ChatMessage
              type="question"
              content={currentQuestion.question}
              difficulty={currentQuestion.difficulty}
              questionNumber={currentQuestionIndex + 1}
            />
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Answer Input */}
      {!isAnswerSubmitted && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Answer:
          </label>
          <textarea
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={4}
          />
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {currentAnswer.length} characters
            </div>
            <Button
              onClick={handleSubmitAnswer}
              disabled={!currentAnswer.trim()}
            >
              Submit Answer
            </Button>
          </div>
        </div>
      )}

      {/* Answer Feedback */}
      {isAnswerSubmitted && answers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">
                Answer submitted! Moving to next question...
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Score: {answers[answers.length - 1].score}/100
              </p>
            </div>
            <div className="text-blue-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get difficulty color (should be imported from helpers)
const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'easy':
      return 'text-green-600 bg-green-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'hard':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export default InterviewChat;
