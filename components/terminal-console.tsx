'use client';

import { useMemo, useState } from 'react';

type TerminalConsoleProps = {
  djName: string;
  bioShort: string;
};

const HELP_LINES = [
  'Available commands: help, about, bpm432, claude, shortcuts.',
  'Use PLAY_LATEST / DATES / BOOKING to jump through the page.'
];

export function TerminalConsole({ djName, bioShort }: TerminalConsoleProps) {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState<string[]>([]);

  const handlers = useMemo(
    () => ({
      help: () => HELP_LINES,
      about: () => [`${djName}: ${bioShort}`],
      bpm432: () => ['[EASTER_EGG] Quantum warmup accepted. Tempo remains dancefloor-safe.'],
      claude: () => ['Nice try. This terminal only boots DJ SHORTCUT protocols.'],
      shortcuts: () => ['Shortcut found: stay curious, keep it groovy, press play.']
    }),
    [bioShort, djName]
  );

  const runCommand = (raw: string) => {
    const normalized = raw.trim().toLowerCase();

    if (!normalized) {
      return;
    }

    const next = handlers[normalized as keyof typeof handlers]
      ? handlers[normalized as keyof typeof handlers]()
      : [`Unknown command: ${normalized}. Try: help`];

    setOutput((prev) => [...prev.slice(-4), `> ${normalized}`, ...next]);
    setCommand('');
  };

  return (
    <section className="panel section" aria-label="Terminal easter eggs">
      <h2>CONSOLE</h2>
      <div className="consoleWrap">
        <label htmlFor="terminal-command" className="consoleLabel">RUN_COMMAND</label>
        <div className="consoleInputRow">
          <input
            id="terminal-command"
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                runCommand(command);
              }
            }}
            placeholder="Type: help"
          />
          <button type="button" onClick={() => runCommand(command)}>
            EXEC
          </button>
        </div>
        {output.length > 0 ? (
          <ul className="consoleOutput">
            {output.map((line, index) => (
              <li key={`${line}-${index}`}>{line}</li>
            ))}
          </ul>
        ) : (
          <p className="muted">Hint: try <code>help</code>, <code>about</code>, or <code>bpm432</code>.</p>
        )}
      </div>
    </section>
  );
}
