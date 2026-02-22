import Image from 'next/image';
import Link from 'next/link';
import DisplayLogo from '@/components/DisplayLogo';
import { BootLog } from '@/components/boot-log';
import { TerminalConsole } from '@/components/terminal-console';
import { getHigherDimensionsSets } from '@/lib/higherDimensions';
import { resolveImageUrl } from '@/lib/resolveImageUrl';
import { getSiteContent } from '@/lib/siteContent';

export default async function Home() {
  const content = getSiteContent();
  const sets = await getHigherDimensionsSets();
  const coverImage = resolveImageUrl(content.coverPhoto);
  const instagramUrl = content.links.instagram
    ? content.links.instagram.startsWith('http')
      ? content.links.instagram
      : `https://instagram.com/${content.links.instagram.replace(/^@/, '')}`
    : '';

  return (
    <main className="pageWrap">
      <section className="panel hero">
        <div className="heroImageWrap" aria-hidden>
          <Image src={coverImage} alt="" fill priority sizes="100vw" />
          <div className="heroOverlay" />
        </div>

        <p className="status">{content.region} · {content.bpmRange}</p>
        <DisplayLogo className="displayLogo" />
        <p className="lead">{content.tagline}</p>
        <p className="bio">{content.bioShort}</p>

        <BootLog lines={content.bootLogLines} />

        <nav className="anchorNav" aria-label="Main sections">
          <a href="#mixes">PLAY_LATEST</a>
          <a href="#gigs">DATES</a>
          <a href="#contact">BOOKING</a>
        </nav>
      </section>

      <section id="mixes" className="panel section">
        <h2>MIXES</h2>
        <ul className="cardList">
          {sets.map((mix, index) => (
            <li key={`${mix.url || 'set'}-${index}`} className="fileCard">
              <p className="fileName">{mix.title || `SET_${index + 1}`}</p>
              <p className="meta">{mix.platform || 'PLATFORM_UNKNOWN'}</p>
              <p className="desc">{mix.description || 'Description unavailable. Open link for full details.'}</p>
              {mix.url ? (
                <Link href={mix.url} target="_blank" rel="noopener noreferrer">
                  OPEN_LINK
                </Link>
              ) : (
                <span className="disabledLink">LINK_UNAVAILABLE</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section id="gigs" className="panel section">
        <h2>GIGS</h2>
        {content.gigs.length === 0 ? (
          <div className="emptyState">
            <p>NO_CONFIRMED_GIGS_YET</p>
            <small>DM on Instagram for bookings.</small>
          </div>
        ) : (
          <ul className="cardList gigList">
            {content.gigs.map((gig, index) => (
              <li key={`${gig.date || 'date'}-${index}`}>
                <strong>{gig.date || 'DATE_TBA'}</strong>
                <span>{gig.venue || 'VENUE_TBA'}</span>
                <span>{gig.city || 'CITY_TBA'}</span>
                {gig.note ? <small>{gig.note}</small> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <TerminalConsole djName={content.djName} bioShort={content.bioShort} />

      <section id="contact" className="panel section">
        <h2>CONTACT</h2>
        <p>{content.contact}</p>
        <ul className="cardList">
          {instagramUrl ? (
            <li>
              <Link href={instagramUrl} target="_blank" rel="noopener noreferrer">INSTAGRAM_DM</Link>
            </li>
          ) : (
            <li>Instagram handle unavailable. Use SoundCloud or YouTube contact paths.</li>
          )}
          {content.links.soundcloud ? (
            <li>
              <Link href={content.links.soundcloud} target="_blank" rel="noopener noreferrer">SOUNDCLOUD</Link>
            </li>
          ) : null}
          {content.links.youtubeChannel ? (
            <li>
              <Link href={content.links.youtubeChannel} target="_blank" rel="noopener noreferrer">YOUTUBE</Link>
            </li>
          ) : null}
        </ul>
      </section>
    </main>
  );
}
