import { useEffect, useState } from 'react';
import { Clock3 } from 'lucide-react';
import { differenceInSeconds, isValid, parseISO } from 'date-fns';

const formatRemaining = (seconds: number) => {
  const safe = Math.max(0, seconds);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const remainingSeconds = safe % 60;
  return `${hours}h ${minutes.toString().padStart(2, '0')}m ${remainingSeconds.toString().padStart(2, '0')}s`;
};

const RescueClock = ({ deadline }: { deadline?: string }) => {
  const [seconds, setSeconds] = useState(() => deadline && isValid(parseISO(deadline)) ? differenceInSeconds(parseISO(deadline), new Date()) : null);
  useEffect(() => {
    if (!deadline || !isValid(parseISO(deadline))) return;
    const timer = window.setInterval(() => setSeconds(differenceInSeconds(parseISO(deadline), new Date())), 1000);
    return () => window.clearInterval(timer);
  }, [deadline]);
  if (seconds === null) return <span className="text-text-secondary">Deadline not configured</span>;
  const closed = seconds <= 0;
  return <span className={`inline-flex items-center gap-1.5 font-mono text-xs font-bold ${closed ? 'text-accent-critical' : 'text-brand-lime'}`}><Clock3 size={14} />{closed ? 'Closed' : formatRemaining(seconds)}</span>;
};

export default RescueClock;
