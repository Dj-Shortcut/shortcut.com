'use client';

import { useEffect, useState } from 'react';

type BootLogProps = {
  lines: string[];
};

export function BootLog({ lines }: BootLogProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);

  useEffect(() => {
    setVisibleLines([]);

    let current = 0;
    const interval = setInterval(() => {
      setVisibleLines((prev) => [...prev, lines[current]]);
      current += 1;

      if (current >= lines.length) {
        clearInterval(interval);
      }
    }, 180);

    return () => clearInterval(interval);
  }, [lines]);

  return (
    <div className="boot">
      <p className="bootLabel">BOOT_LOG</p>
      <ul>
        {visibleLines.map((line, index) => (
          <li key={`${line}-${index}`}>
            <span>›</span>
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}
