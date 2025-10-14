import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate?: Date;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  // Default to 24 hours from now if no target date provided
  const defaultTarget = new Date();
  defaultTarget.setHours(defaultTarget.getHours() + 24);
  
  const target = targetDate || defaultTarget;
  
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const targetTime = target.getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <span className="text-accent font-semibold">⏰</span>
      <span>
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </span>
    </div>
  );
}