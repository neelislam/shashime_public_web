import './globals.css';
import Navbar from '@/components/Navbar'; // Importing our new interactive Navbar!

export const metadata = {
  title: 'SHASHEME | Good Food, Good Mood',
  description: 'Premium spicy food and catering.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0b0b0b] text-white antialiased overflow-x-hidden">
        
        {/* The Navbar now handles its own display and the Menu popup */}
        <Navbar />

        {/* THIS IS WHERE YOUR PAGES LOAD */}
        {children}
        
      </body>
    </html>
  );
}