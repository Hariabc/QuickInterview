import React from 'react';
import { formatTime, getTimerColor } from '../../utils/timer';

const TimerDisplay = ({ timer }) => {
  if (!timer) return null;

  const remainingTime = timer.getRemainingTime();
  const totalTime = timer.duration;
  const progress = (totalTime - remainingTime) / totalTime;

  return (
    <div className="flex items-center space-x-3">
      {/* Circular Progress */}
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
          {/* Background circle */}
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2"
          />
          {/* Progress circle */}
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray={`${progress * 100}, 100`}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Time text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-700">
            {formatTime(remainingTime)}
          </span>
        </div>
      </div>

      {/* Time remaining text */}
      <div className="text-sm">
        <div className={`font-medium ${getTimerColor(remainingTime, totalTime)}`}>
          {formatTime(remainingTime)}
        </div>
        <div className="text-xs text-gray-500">
          remaining
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;
