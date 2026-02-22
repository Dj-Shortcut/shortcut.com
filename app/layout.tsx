import type { Metadata } from 'next';
import './globals.css';
import { resolveImageUrl } from '@/lib/resolveImageUrl';
import { getSiteContent } from '@/lib/siteContent';

export async function generateMetadata(): Promise<Metadata> {
  const content = getSiteContent();
  const title = content.djName || 'DJ SHORTCUT';
  const description = content.tagline || content.bioShort || 'Music for the mind.';
  const image = resolveImageUrl(content.ogImage ?? content.coverPhoto);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image]
    }
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
