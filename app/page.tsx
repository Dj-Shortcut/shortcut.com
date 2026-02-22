import Image from 'next/image';
import Link from 'next/link';
import { BootLog } from '@/components/boot-log';

const mixes = [
  { title: 'Higher Dimensions 1', href: 'https://www.youtube.com/watch?v=i1fTe_pjNnM' },
  { title: 'Higher Dimensions 2', href: 'https://www.youtube.com/watch?v=eL_GT27eTlc' },
  { title: 'Higher Dimensions 3', href: 'https://www.youtube.com/watch?v=8xUS9LuWnCk' }
];

const gigs: { title: string; date: string; venue: string }[] = [];

const contact = {
  instagram: 'https://www.instagram.com/shortcutsareforlosers/',
  email: ''
};

export default function Home() {
  return (
    <main className="pageWrap">
      <section className="panel hero">
        <p className="status">DJ-SHORTCUT.exe v2.0 · LIVE</p>
        <h1>DJ-Shortcut</h1>
        <p className="lead">Music for the mind. Electronic dance, melodic journeys, and underground grooves.</p>
        <div className="heroImageWrap">
          <Image src="/hero-wave.svg" alt="Abstract waveform artwork" fill priority sizes="(max-width: 768px) 100vw, 960px" />
        </div>
        <BootLog />
        <nav className="anchorNav" aria-label="Main sections">
          <a href="#mixes">Mixes</a>
          <a href="#gigs">Gigs</a>
          <a href="#contact">Contact</a>
        </nav>
      </section>

      <section id="mixes" className="panel section">
        <h2>Mixes</h2>
        <ul className="cardList">
          {mixes.map((mix) => (
            <li key={mix.href}>
              <Link href={mix.href} target="_blank" rel="noopener noreferrer">
                {mix.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="gigs" className="panel section">
        <h2>Gigs</h2>
        {gigs.length === 0 ? (
          <div className="emptyState">
            <p>No gigs announced yet.</p>
            <small>Check back soon for new dates and venues.</small>
          </div>
        ) : (
          <ul className="cardList">
            {gigs.map((gig) => (
              <li key={`${gig.date}-${gig.venue}`}>
                <strong>{gig.title}</strong>
                <span>{gig.date}</span>
                <span>{gig.venue}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="contact" className="panel section">
        <h2>Contact</h2>
        {contact.email ? (
          <p>
            Booking by email: <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </p>
        ) : (
          <div className="emptyState">
            <p>Email is currently not configured.</p>
            <small>DM-only for now: please reach out via Instagram.</small>
          </div>
        )}
        <p>
          Instagram: <Link href={contact.instagram}>@shortcutsareforlosers</Link>
        </p>
      </section>
    </main>
  );
}
