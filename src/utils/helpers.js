// General utility functions

// Generate unique ID
export const generateId = () => {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Validate file type
export const validateFileType = (file, allowedTypes) => {
  const fileExtension = file.name.split('.').pop().toLowerCase();
  return allowedTypes.includes(fileExtension);
};

// Get file icon based on type
export const getFileIcon = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return '📄';
    case 'docx':
    case 'doc':
      return '📝';
    default:
      return '📎';
  }
};

// Sort candidates by score (highest first)
export const sortCandidatesByScore = (candidates) => {
  return [...candidates].sort((a, b) => {
    const scoreA = a.finalScore || 0;
    const scoreB = b.finalScore || 0;
    return scoreB - scoreA;
  });
};

// Search candidates
export const searchCandidates = (candidates, searchTerm) => {
  if (!searchTerm.trim()) return candidates;
  
  const term = searchTerm.toLowerCase();
  return candidates.filter(candidate => 
    candidate.name?.toLowerCase().includes(term) ||
    candidate.email?.toLowerCase().includes(term) ||
    candidate.phone?.includes(term)
  );
};

// Get difficulty color
export const getDifficultyColor = (difficulty) => {
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

// Get score color
export const getScoreColor = (score) => {
  if (score >= 90) return 'text-green-600 bg-green-100';
  if (score >= 80) return 'text-blue-600 bg-blue-100';
  if (score >= 70) return 'text-yellow-600 bg-yellow-100';
  if (score >= 60) return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
};

// Get rating emoji
export const getRatingEmoji = (rating) => {
  switch (rating) {
    case 'Excellent':
      return '🌟';
    case 'Very Good':
      return '👍';
    case 'Good':
      return '✅';
    case 'Satisfactory':
      return '⚡';
    case 'Needs Improvement':
      return '📈';
    default:
      return '❓';
  }
};

// Calculate interview progress percentage
export const calculateProgress = (currentQuestion, totalQuestions) => {
  return Math.round((currentQuestion / totalQuestions) * 100);
};

// Check if interview is complete
export const isInterviewComplete = (currentQuestion, totalQuestions) => {
  return currentQuestion >= totalQuestions;
};

// Get interview status
export const getInterviewStatus = (session) => {
  if (!session) return 'not_started';
  if (session.status === 'completed') return 'completed';
  if (session.status === 'in_progress') return 'in_progress';
  return 'not_started';
};

// Format duration for display
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
};

// Local storage helpers
export const localStorage = {
  set: (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  get: (key) => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  remove: (key) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

export default {
  generateId,
  debounce,
  formatFileSize,
  validateFileType,
  getFileIcon,
  sortCandidatesByScore,
  searchCandidates,
  getDifficultyColor,
  getScoreColor,
  getRatingEmoji,
  calculateProgress,
  isInterviewComplete,
  getInterviewStatus,
  formatDuration,
  localStorage
};
