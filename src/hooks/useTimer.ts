import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerOptions {
  initialTime: number;
  onComplete?: () => void;
  onTick?: (timeLeft: number) => void;
  enabled?: boolean;
}

export function useTimer({ initialTime, onComplete, onTick, enabled = true }: UseTimerOptions) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  const onTickRef = useRef(onTick);
  const initialTimeRef = useRef(initialTime);

  // Update refs when callbacks change
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onTickRef.current = onTick;
  }, [onComplete, onTick]);

  // Update initialTime ref when it changes
  useEffect(() => {
    initialTimeRef.current = initialTime;
  }, [initialTime]);

  // Reset timer to initial time
  const reset = useCallback(() => {
    setTimeLeft(initialTimeRef.current);
    setIsPaused(false);
  }, []);

  // Pause timer
  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  // Resume timer
  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Start timer
  useEffect(() => {
    if (!enabled || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (timeLeft <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      onCompleteRef.current?.();
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        onTickRef.current?.(newTime);
        if (newTime <= 0) {
          onCompleteRef.current?.();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, isPaused, timeLeft]);

  return {
    timeLeft,
    isPaused,
    reset,
    pause,
    resume,
  };
}

