'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // Adjust to '../lib/supabase' if needed
import Link from 'next/link';
import { ArrowRight, Leaf, ChefHat, ConciergeBell, Star, Heart } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();

    const channel = supabase
      .channel('public-products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        if (payload.eventType === 'INSERT') setProducts(prev => [payload.new, ...prev]);
        if (payload.eventType === 'UPDATE') setProducts(prev => prev.map(item => item.id === payload.new.id ? payload.new : item));
        if (payload.eventType === 'DELETE') setProducts(prev => prev.filter(item => item.id !== payload.old.id));
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white font-sans overflow-x-hidden">
      
      {/* 1. NAVBAR */}
      <nav className="flex items-center justify-between px-6 md:px-16 py-6 sticky top-0 z-50 bg-[#0b0b0b]/90 backdrop-blur-md">
        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-widest text-white flex items-center gap-2">
          <span className="bg-[#ff6b00] text-white px-2 py-1 rounded-lg">SH</span> ASHEME
        </Link>

        {/* Links */}
        <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-300">
          <Link href="/" className="text-[#ff6b00] hover:text-[#ff6b00] transition">Home</Link>
          <Link href="/menu" className="hover:text-[#ff6b00] transition">Menu</Link>
          <Link href="/about" className="hover:text-[#ff6b00] transition">About Us</Link>
          <Link href="/gallery" className="hover:text-[#ff6b00] transition">Gallery</Link>
          <Link href="/contact" className="hover:text-[#ff6b00] transition">Contact</Link>
          <Link href="/custom-order" className="hover:text-[#ff6b00] transition">Customized Order</Link>
        </div>

        {/* Admin Link */}
        <Link href="/admin" className="text-xs font-bold text-gray-500 hover:text-white transition">
          Admin
        </Link>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative px-6 md:px-16 py-12 md:py-24 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 z-10">
          <h2 className="text-5xl md:text-7xl mb-[-10px] text-white" style={{ fontFamily: 'cursive' }}>
            Good Food
          </h2>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight mb-6">
            Good <span className="text-[#ff6b00]">Mood</span>
          </h1>
          
          {/* Decorative Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-16 bg-gray-500"></div>
            <Heart className="w-4 h-4 text-[#ff6b00] fill-[#ff6b00]" />
            <div className="h-[1px] w-16 bg-gray-500"></div>
          </div>

          <p className="text-gray-400 text-lg mb-10 max-w-sm">
            Delicious meals made with fresh ingredients, served with love.
          </p>

          <div className="flex gap-4">
            <Link href="/menu" className="bg-[#ff6b00] hover:bg-[#e65c00] text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 transition">
              VIEW MENU <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="border border-white hover:bg-white hover:text-black text-white font-bold py-3 px-8 rounded-full transition">
              RESERVE NOW
            </Link>
          </div>
        </div>

        {/* Hero Image Area (Right Side) */}
        <div className="md:w-1/2 mt-12 md:mt-0 relative flex justify-end">
          {/* You can replace this src with your own transparent background food image later */}
          <img 
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop" 
            alt="Delicious Pasta" 
            className="w-[500px] h-[500px] object-cover rounded-full shadow-2xl border-4 border-[#1a1a1a] shadow-[#ff6b00]/20"
          />
        </div>
      </section>

      {/* 3. FEATURES BANNER */}
      <section className="px-6 md:px-16 mt-[-40px] relative z-20">
        <div className="bg-[#f8f5f0] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl">
          
          <div className="flex flex-col items-center text-center max-w-[250px]">
            <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mb-4 text-[#ff6b00]">
              <Leaf className="w-8 h-8" />
            </div>
            <h3 className="text-black font-black text-lg mb-2">FRESH INGREDIENTS</h3>
            <p className="text-gray-600 text-sm font-medium">We use only the freshest & finest ingredients.</p>
          </div>

          <div className="hidden md:block w-[1px] h-24 bg-gray-300"></div>

          <div className="flex flex-col items-center text-center max-w-[250px]">
            <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mb-4 text-[#ff6b00]">
              <ChefHat className="w-8 h-8" />
            </div>
            <h3 className="text-black font-black text-lg mb-2">EXPERT CHEFS</h3>
            <p className="text-gray-600 text-sm font-medium">Our chefs craft every dish with passion and expertise.</p>
          </div>

          <div className="hidden md:block w-[1px] h-24 bg-gray-300"></div>

          <div className="flex flex-col items-center text-center max-w-[250px]">
            <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mb-4 text-[#ff6b00]">
              <ConciergeBell className="w-8 h-8" />
            </div>
            <h3 className="text-black font-black text-lg mb-2">QUALITY SERVICE</h3>
            <p className="text-gray-600 text-sm font-medium">Fast, friendly & professional service every time.</p>
          </div>

        </div>
      </section>

      {/* 4. CHEF'S SPECIALS (LIVE DB MENU) */}
      <section className="px-6 md:px-16 py-24">
        <div className="text-center mb-16">
          <p className="text-[#ff6b00] font-bold text-sm tracking-widest uppercase mb-4 flex items-center justify-center gap-4">
            <span className="w-12 h-[1px] bg-[#ff6b00]"></span> POPULAR DISHES <span className="w-12 h-[1px] bg-[#ff6b00]"></span>
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Our Chefs Specials</h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-gray-600"></div>
            <span className="text-[#ff6b00]">✖</span>
            <div className="h-[1px] w-12 bg-gray-600"></div>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading specials...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((item) => (
              <div key={item.id} className="bg-[#121212] rounded-2xl p-4 border border-[#1f1f1f] group relative">
                
                {/* Heart Icon Top Right */}
                <button className="absolute top-6 right-6 z-10 w-10 h-10 bg-[#ff6b00] rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="w-5 h-5" />
                </button>

                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-64 object-cover rounded-xl mb-6" />
                ) : (
                  <div className="w-full h-64 bg-[#1a1a1a] rounded-xl mb-6 flex items-center justify-center text-gray-600">No Image</div>
                )}
                
                <h3 className="text-xl font-serif font-bold text-white mb-2">{item.name}</h3>
                
                {/* Dummy Stars for UI completeness based on image */}
                <div className="flex items-center gap-1 mb-4 text-[#ff6b00]">
                  <Star className="w-4 h-4 fill-[#ff6b00]" />
                  <Star className="w-4 h-4 fill-[#ff6b00]" />
                  <Star className="w-4 h-4 fill-[#ff6b00]" />
                  <Star className="w-4 h-4 fill-[#ff6b00]" />
                  <Star className="w-4 h-4 fill-[#ff6b00]" />
                  <span className="text-gray-500 text-sm ml-2">(125)</span>
                </div>

                <p className="text-2xl font-bold text-[#ff6b00]">${item.price}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}