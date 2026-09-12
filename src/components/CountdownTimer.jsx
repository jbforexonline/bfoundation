import { useEffect, useState } from 'react';
import './CountdownTimer.scss';

function getTimeLeft(targetDate) {
  const diff = Math.max(0, targetDate.getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

const pad = (n) => String(n).padStart(2, '0');

export default function CountdownTimer({ targetDate }) {
  const [time, setTime] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Mins', value: time.minutes },
    { label: 'Secs', value: time.seconds },
  ];

  return (
    <div className="countdown" role="timer" aria-live="polite">
      {units.map((unit) => (
        <div className="countdown__unit" key={unit.label}>
          <span className="countdown__value">{pad(unit.value)}</span>
          <span className="countdown__label">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
