import './globals.css';

export const metadata = {
  title: 'SHASHEME | Spicy Delights',
  description: 'Live Realtime Menu for SHASHEME',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}