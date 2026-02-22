'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import type { SiteContent } from '@/lib/siteContent';
import {
  commandToAction,
  getSceneOutput,
  initialTerminalState,
  runAction,
  type ActionChip,
  type TransitionResult
} from '@/lib/terminalScript';

type TerminalConsoleProps = {
  content: SiteContent;
};

const THINKING_LINE = '...thinking';

export function TerminalConsole({ content }: TerminalConsoleProps) {
  const [command, setCommand] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [actions, setActions] = useState<ActionChip[]>([]);
  const [state, setState] = useState(initialTerminalState);
  const logRef = useRef<HTMLDivElement | null>(null);

  const typeLines = useMemo(
    () => (lines: string[], withThinking = false) => {
      let delay = 0;
      if (withThinking) {
        window.setTimeout(() => {
          setOutput((prev) => [...prev, THINKING_LINE]);
        }, delay);
        delay += 280;
      }

      lines.forEach((line) => {
        window.setTimeout(() => {
          setOutput((prev) => {
            const trimmed = prev.filter((entry) => entry !== THINKING_LINE);
            return [...trimmed, line];
          });
        }, delay);
        delay += 160;
      });
    },
    []
  );

  useEffect(() => {
    const intro = getSceneOutput('intro', initialTerminalState, content);
    setActions(intro.actions);
    typeLines(intro.lines, intro.showThinking);
  }, [content, typeLines]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [output]);

  const applyTransition = (transition: TransitionResult) => {
    if (transition.clearOutput) {
      setOutput([]);
    }

    setActions(transition.actions);
    setState(transition.state);
    typeLines(transition.lines, transition.showThinking);

    if (transition.openUrl) {
      window.open(transition.openUrl, '_blank', 'noopener,noreferrer');
    }

    if (transition.copyValue && navigator.clipboard) {
      navigator.clipboard.writeText(transition.copyValue).catch(() => {
        setOutput((prev) => [...prev, 'Clipboard unavailable in this browser context.']);
      });
    }
  };

  const runChipAction = (action: ActionChip) => {
    applyTransition(runAction(action, state, content));
  };

  const runCommand = () => {
    const userCommand = command.trim();
    if (!userCommand) {
      return;
    }

    setOutput((prev) => [...prev, `> ${userCommand}`]);

    const action = commandToAction(userCommand);
    if (!action) {
      setOutput((prev) => [...prev, 'Unknown command. Type "help" for options.']);
      setCommand('');
      return;
    }

    applyTransition(runAction(action, state, content));
    setCommand('');
  };

  return (
    <section className="terminalPanel" aria-label="Scripted interactive terminal">
      <header className="terminalHeader">
        <p>{content.djName}_TERMINAL</p>
        <button type="button" onClick={() => setShowInput((prev) => !prev)}>
          {showInput ? 'Hide Input' : 'Type Command'}
        </button>
      </header>

      <div className="terminalOutput" ref={logRef}>
        {output.map((line, index) => (
          <p key={`${line}-${index}`}>{line}</p>
        ))}
      </div>

      <div className="chipRow" aria-label="Action chips">
        {actions.map((action, index) => (
          <button key={`${action.label}-${index}`} type="button" onClick={() => runChipAction(action)}>
            {action.label}
          </button>
        ))}
        <button type="button" onClick={() => runChipAction({ label: 'Clear', actionId: 'clear' })}>
          Clear
        </button>
      </div>

      {showInput ? (
        <div className="consoleInputRow">
          <input
            id="terminal-command"
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                runCommand();
              }
            }}
            placeholder='Type command: help, mixes, mix 1, open...'
          />
          <button type="button" onClick={runCommand}>
            Run
          </button>
        </div>
      ) : null}
    </section>
  );
}
