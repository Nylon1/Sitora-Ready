import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sitora Ready™ | Pre-Care Intelligence for Healthcare',
  description: 'Patient understanding, readiness and pre-care intelligence for healthcare.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
