"use client";

import { useEffect, useState, useRef } from "react";

interface TimerProps {
  duration: number; // in seconds
  onComplete: () => void;
  isActive: boolean;
  onReset?: () => void;
  currentTime?: number;
}

export function Timer({ duration, onComplete, isActive, onReset, currentTime }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(currentTime || duration);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Update timeLeft when currentTime changes
  useEffect(() => {
    if (currentTime !== undefined) {
      setTimeLeft(currentTime);
    }
  }, [currentTime]);

  // Handle countdown
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, onComplete]);

  // Handle reset
  useEffect(() => {
    if (onReset) {
      setTimeLeft(duration);
    }
  }, [duration, onReset]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-mono">
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </div>
    </div>
  );
} 