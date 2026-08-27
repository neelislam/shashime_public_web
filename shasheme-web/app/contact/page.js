'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Contact() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white overflow-x-hidden pb-24">


      <div className="px-6 md:px-16 py-24 flex flex-col lg:flex-row gap-16">
        {/* Info Side */}
        <div className="lg:w-1/3">
          <h1 className="text-5xl font-serif font-bold text-white mb-6">Get in Touch</h1>
          <p className="text-gray-400 mb-12">Have a question or want to reserve a table? Reach out to us below.</p>
          
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#121212] flex items-center justify-center border border-[#1f1f1f] text-[#ff6b00]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Location</h3>
                <p className="text-gray-500">123 Flavor Street<br/>Zindabazar, Sylhet 3100</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#121212] flex items-center justify-center border border-[#1f1f1f] text-[#ff6b00]">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Call Us</h3>
                <p className="text-gray-500">+880 1234 567 890</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#121212] flex items-center justify-center border border-[#1f1f1f] text-[#ff6b00]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Email</h3>
                <p className="text-gray-500">hello@shasheme.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="lg:w-2/3 bg-[#121212] p-8 md:p-12 rounded-3xl border border-[#1f1f1f]">
          <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm text-gray-400 mb-2">First Name</label>
              <input type="text" className="w-full bg-[#0b0b0b] border border-[#1f1f1f] rounded-lg p-4 text-white focus:outline-none focus:border-[#ff6b00]" placeholder="John" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm text-gray-400 mb-2">Last Name</label>
              <input type="text" className="w-full bg-[#0b0b0b] border border-[#1f1f1f] rounded-lg p-4 text-white focus:outline-none focus:border-[#ff6b00]" placeholder="Doe" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Email Address</label>
              <input type="email" className="w-full bg-[#0b0b0b] border border-[#1f1f1f] rounded-lg p-4 text-white focus:outline-none focus:border-[#ff6b00]" placeholder="john@example.com" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Message</label>
              <textarea rows="5" className="w-full bg-[#0b0b0b] border border-[#1f1f1f] rounded-lg p-4 text-white focus:outline-none focus:border-[#ff6b00]" placeholder="How can we help you?"></textarea>
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="w-full bg-[#ff6b00] hover:bg-[#e65c00] text-white font-bold py-4 rounded-lg transition">Send Message</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}