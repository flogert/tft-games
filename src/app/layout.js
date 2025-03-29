import './styles/globals.css';

export const metadata = {
  title: 'TFTdle',
  description: 'Guess TFT items, augments, or tacticians!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}