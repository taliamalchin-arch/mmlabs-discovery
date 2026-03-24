'use client';

import { useState, useEffect } from 'react';

interface LoadingProps {
  done: boolean;
  error?: string;
}

export default function Loading({ done, error }: LoadingProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setWidth(35), 300);
    const t2 = setTimeout(() => setWidth(58), 1500);
    const t3 = setTimeout(() => setWidth(75), 3000);
    const t4 = setTimeout(() => setWidth(88), 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  useEffect(() => {
    if (done) setWidth(100);
  }, [done]);

  return (
    <div className="screen-enter">
      <div className="loading-screen">
        <h2 className="loading-heading">
          {error ? 'Building from your answers' : 'Building your brief'}
        </h2>
        <p className="loading-sub">
          {error
            ? 'AI analysis unavailable — generating a working draft from your raw answers'
            : 'Analyzing answers and generating recommendations'}
        </p>
        {!error && (
          <div className="loading-dots">
            <div className="loading-dot" />
            <div className="loading-dot" />
            <div className="loading-dot" />
          </div>
        )}
        <div className="loading-track">
          <div className="loading-fill" style={{ width: `${width}%` }} />
        </div>
      </div>
    </div>
  );
}
