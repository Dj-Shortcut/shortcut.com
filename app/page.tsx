import { TerminalConsole } from '@/components/terminal-console';
import { getSiteContent } from '@/lib/siteContent';

export default function Home() {
  const content = getSiteContent();

  return (
    <main className="pageWrap">
      <TerminalConsole content={content} />
    </main>
  );
}
