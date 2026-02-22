export const metadata = {
  title: 'Shortcut Next App',
  description: 'Minimal Next.js application for project checks.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
