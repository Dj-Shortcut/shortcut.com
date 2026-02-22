export default function HomePage() {
  return (
    <main className="page" id="top">
      <section className="panel hero" aria-labelledby="hero-title">
        <p className="status">DJ-SHORTCUT.exe // LIVE</p>
        <h1 id="hero-title">DJ-Shortcut</h1>
        <p className="lead">
          Music for the mind. Electronic dance music, atmospheric grooves, and underground energy.
        </p>

        <nav className="commands" aria-label="Hero commands">
          <a className="command" href="#mixes">
            <span>&gt;</span> PLAY_LATEST
          </a>
          <a className="command" href="#gigs">
            <span>&gt;</span> DATES
          </a>
          <a className="command" href="#contact">
            <span>&gt;</span> BOOKING
          </a>
        </nav>
      </section>

      <section className="panel" id="mixes" aria-labelledby="mixes-title">
        <h2 id="mixes-title">Mixes</h2>
        <p>Latest sessions and recorded journeys.</p>
        <ul>
          <li>Higher Dimensions 3</li>
          <li>Higher Dimensions 2</li>
          <li>Higher Dimensions 1</li>
        </ul>
      </section>

      <section className="panel" id="gigs" aria-labelledby="gigs-title">
        <h2 id="gigs-title">Gigs</h2>
        <p>Upcoming dates and live appearances.</p>
        <ul>
          <li>No gigs announced yet — check back soon.</li>
        </ul>
      </section>

      <section className="panel" id="contact" aria-labelledby="contact-title">
        <h2 id="contact-title">Contact</h2>
        <p>For bookings and collaborations:</p>
        <p>
          <a href="mailto:booking@dj-shortcut.com">booking@dj-shortcut.com</a>
        </p>
      </section>

      <style jsx>{`
        :global(html) {
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
            'Courier New', monospace;
          background: #050805;
          color: #d7ffe6;
        }

        .page {
          max-width: 920px;
          margin: 0 auto;
          padding: 1rem;
          display: grid;
          gap: 1rem;
        }

        .panel {
          border: 1px solid rgba(33, 255, 106, 0.3);
          border-radius: 14px;
          padding: 1rem;
          background: linear-gradient(180deg, rgba(7, 18, 11, 0.95), rgba(5, 8, 5, 0.85));
        }

        .hero {
          min-height: 42vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .status {
          margin: 0;
          color: #7acf98;
          font-size: 0.8rem;
        }

        h1 {
          margin: 0.5rem 0;
          font-size: clamp(2rem, 8vw, 3.25rem);
          line-height: 1.05;
        }

        .lead {
          margin: 0;
          max-width: 55ch;
          color: #b7ebca;
          line-height: 1.5;
        }

        .commands {
          margin-top: 1.2rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        .command {
          text-decoration: none;
          color: #d7ffe6;
          border: 1px solid rgba(33, 255, 106, 0.3);
          border-radius: 10px;
          padding: 0.6rem 0.8rem;
          font-size: 0.92rem;
          background: rgba(0, 0, 0, 0.2);
        }

        .command span {
          color: #21ff6a;
          font-weight: 700;
        }

        h2 {
          margin: 0;
          font-size: 1.35rem;
        }

        p,
        li {
          color: #c9f7d9;
          line-height: 1.55;
        }

        ul {
          margin: 0.75rem 0 0;
          padding-left: 1.2rem;
        }

        a {
          color: #21ff6a;
        }

        @media (max-width: 640px) {
          .page {
            padding: 0.75rem;
            gap: 0.75rem;
          }

          .panel {
            padding: 0.9rem;
          }

          .hero {
            min-height: 36vh;
          }

          .command {
            width: 100%;
            text-align: center;
            padding: 0.72rem 0.8rem;
          }
        }
      `}</style>
    </main>
  );
}
