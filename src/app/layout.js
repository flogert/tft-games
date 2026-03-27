import { Ysabeau_SC } from 'next/font/google';
import './styles/globals.css';

const ysabeau = Ysabeau_SC({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ysabeau',
});

export const metadata = {
  title: 'TFTdle',
  description: 'Guess TFT items, augments, or tacticians!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={ysabeau.variable}>{children}</body>
    </html>
  );
}