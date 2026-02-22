'use client';

import { useEffect, useState } from 'react';

const bootLines = [
  '[SYS] INITIALIZING DJ-SHORTCUT PROFILE...',
  '[OK] LOADING GENRES -> deep house, melodic techno, indie dance...',
  '[OK] SYNCING RANGE -> 123–145 BPM',
  '[OK] ROUTING OUTPUT -> MINDSPACE',
  '[OK] READY'
];

export function BootLog() {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      setLines((prev) => [...prev, bootLines[current]]);
      current += 1;
      if (current >= bootLines.length) {
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="boot">
      <p className="bootLabel">BOOT_LOG</p>
      <ul>
        {lines.map((line) => (
          <li key={line}>
            <span>›</span>
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}
