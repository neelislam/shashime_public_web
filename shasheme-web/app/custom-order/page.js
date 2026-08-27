'use client';

import Link from 'next/link';

export default function CustomOrder() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white overflow-x-hidden pb-24">


      <div className="px-6 md:px-16 py-16 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Customized Orders & Catering</h1>
          <p className="text-gray-400">Hosting an event? Let us bring the spice to you. Fill out the form below to request a custom menu.</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="bg-[#121212] p-8 md:p-12 rounded-3xl border border-[#1f1f1f] space-y-8">
          
          {/* Event Details */}
          <div>
            <h3 className="text-[#ff6b00] font-bold uppercase tracking-widest text-sm mb-4 border-b border-[#1f1f1f] pb-2">Event Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Event Date</label>
                <input type="date" className="w-full bg-[#0b0b0b] border border-[#1f1f1f] rounded-lg p-3 text-white focus:outline-none focus:border-[#ff6b00]" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Number of Guests</label>
                <input type="number" className="w-full bg-[#0b0b0b] border border-[#1f1f1f] rounded-lg p-3 text-white focus:outline-none focus:border-[#ff6b00]" placeholder="e.g., 50" />
              </div>
            </div>
          </div>

          {/* Food Preferences */}
          <div>
            <h3 className="text-[#ff6b00] font-bold uppercase tracking-widest text-sm mb-4 border-b border-[#1f1f1f] pb-2">Food Preferences</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Preferred Spice Level for the Crowd</label>
                <select className="w-full bg-[#0b0b0b] border border-[#1f1f1f] rounded-lg p-3 text-white focus:outline-none focus:border-[#ff6b00]">
                  <option>Keep it Mild & Safe</option>
                  <option>Medium - A good kick</option>
                  <option>Extra Hot - Bring the fire!</option>
                  <option>Mixed Selection</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Specific Dietary Requests & Menu Ideas</label>
                <textarea rows="4" className="w-full bg-[#0b0b0b] border border-[#1f1f1f] rounded-lg p-3 text-white focus:outline-none focus:border-[#ff6b00]" placeholder="Any allergies? Preferred dishes?"></textarea>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#ff6b00] hover:bg-[#e65c00] text-white font-bold py-4 rounded-lg transition text-lg shadow-lg shadow-[#ff6b00]/20">
            Submit Order Request
          </button>

        </form>
      </div>
    </main>
  );
}