// Timer utility for interview questions
export class Timer {
  constructor(duration, onTick, onComplete) {
    this.duration = duration; // in seconds
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.startTime = null;
    this.remainingTime = duration;
    this.intervalId = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.startTime = Date.now();
    
    this.intervalId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this.remainingTime = Math.max(0, this.duration - elapsed);
      
      if (this.onTick) {
        this.onTick(this.remainingTime);
      }
      
      if (this.remainingTime <= 0) {
        this.stop();
        if (this.onComplete) {
          this.onComplete();
        }
      }
    }, 1000);
  }

  stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  pause() {
    if (!this.isRunning) return;
    
    this.stop();
    // Don't reset startTime, so we can resume from where we left off
  }

  resume() {
    if (this.isRunning || this.remainingTime <= 0) return;
    
    // Adjust duration to remaining time and restart
    this.duration = this.remainingTime;
    this.start();
  }

  reset() {
    this.stop();
    this.remainingTime = this.duration;
    this.startTime = null;
  }

  getRemainingTime() {
    return this.remainingTime;
  }

  getElapsedTime() {
    return this.duration - this.remainingTime;
  }

  getProgress() {
    return (this.duration - this.remainingTime) / this.duration;
  }

  isExpired() {
    return this.remainingTime <= 0;
  }
}

// Format time in MM:SS format
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Format timestamp for display
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

// Format date for display
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

// Calculate time remaining in a more user-friendly format
export const getTimeRemainingText = (seconds) => {
  if (seconds <= 0) return 'Time\'s up!';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s remaining`;
  } else {
    return `${remainingSeconds}s remaining`;
  }
};

// Get timer color based on remaining time
export const getTimerColor = (remainingTime, totalTime) => {
  const percentage = (remainingTime / totalTime) * 100;
  
  if (percentage > 50) return 'text-green-600';
  if (percentage > 25) return 'text-yellow-600';
  if (percentage > 10) return 'text-orange-600';
  return 'text-red-600';
};

export default Timer;
