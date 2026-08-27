'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase'; // Make sure this path is correct! Use '../lib/supabase' if needed.
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch data and lock background scrolling when the modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      if (products.length === 0) {
        supabase.from('products').select('*').order('category').then(({ data }) => {
          setProducts(data || []);
          setLoading(false);
        });
      }
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isModalOpen, products.length]);

  // Pagination Logic (4 items per page)
  const itemsPerPage = 4;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentItems = products.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const changePage = (newDirection) => {
    setDirection(newDirection);
    setPage((prev) => prev + newDirection);
  };

  const openMenu = () => {
    setLoading(true);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* 1. THE NAVBAR */}
      <nav className="flex items-center justify-between px-6 md:px-16 py-6 sticky top-0 z-50 bg-[#0b0b0b]/90 backdrop-blur-md border-b border-[#1f1f1f]">
        <Link href="/" className="text-2xl font-black tracking-widest text-white flex items-center gap-2">
          <span className="bg-[#ff6b00] text-white px-2 py-1 rounded-lg">SHASHEME</span>
        </Link>

        <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-300">
          <Link href="/" className="hover:text-[#ff6b00] transition">Home</Link>
          
          {/* Menu button now triggers the modal instead of linking to a page */}
          <button onClick={openMenu} className="hover:text-[#ff6b00] transition cursor-pointer">
            Menu
          </button>
          
          <Link href="/about" className="hover:text-[#ff6b00] transition">About Us</Link>
          <Link href="/gallery" className="hover:text-[#ff6b00] transition">Gallery</Link>
          <Link href="/contact" className="hover:text-[#ff6b00] transition">Contact</Link>
          <Link href="/custom-order" className="hover:text-[#ff6b00] transition">Customized Order</Link>
        </div>
        
        <div className="hidden md:block w-[72px]"></div> 
      </nav>

      {/* 2. THE SLIDING BOOK MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            
            {/* Dark Blur Overlay */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-5xl bg-[#121212] border border-[#1f1f1f] rounded-2xl shadow-2xl flex flex-col h-[85vh] md:h-[75vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-[#1f1f1f]">
                <h2 className="text-3xl font-serif font-bold text-white">Full Menu</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-[#ff6b00] transition">
                  <X className="w-8 h-8" />
                </button>
              </div>

              {/* Body: Animated Book Pages */}
              <div className="flex-1 relative p-2 md:p-6 overflow-hidden">
                {loading ? (
                  <div className="flex justify-center items-center h-full text-[#ff6b00]">Loading spicy delights...</div>
                ) : products.length === 0 ? (
                  <div className="flex justify-center items-center h-full text-gray-500">The menu is currently empty.</div>
                ) : (
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={page}
                      custom={direction}
                      initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="absolute inset-0 w-full h-full p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 content-start overflow-y-auto"
                    >
                      {currentItems.map(item => (
                        <div key={item.id} className="flex gap-4 items-center bg-[#0b0b0b] p-4 rounded-xl border border-[#1f1f1f] hover:border-[#ff6b00]/50 transition">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg" />
                          ) : (
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-xs text-gray-600">No Img</div>
                          )}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-bold text-white text-lg leading-tight">{item.name}</h3>
                              <p className="text-[#ff6b00] font-black">${item.price}</p>
                            </div>
                            <span className="text-xs text-gray-500 uppercase tracking-wider block">{item.category}</span>
                            <span className="text-xs border border-[#ff6b00]/30 text-[#ff6b00] px-2 py-0.5 rounded mt-2 inline-block">
                              {item.spiciness}
                            </span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {/* Footer: Slide Arrows */}
              <div className="p-4 md:p-6 border-t border-[#1f1f1f] flex justify-between items-center bg-[#0b0b0b]">
                <button 
                  onClick={() => changePage(-1)} disabled={page === 0}
                  className="p-3 rounded-full bg-[#121212] border border-[#1f1f1f] text-white hover:text-[#ff6b00] disabled:opacity-30 disabled:hover:text-white transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <span className="text-gray-400 font-medium tracking-widest text-sm uppercase">
                  Page {page + 1} of {totalPages || 1}
                </span>
                
                <button 
                  onClick={() => changePage(1)} disabled={page === totalPages - 1 || totalPages === 0}
                  className="p-3 rounded-full bg-[#121212] border border-[#1f1f1f] text-white hover:text-[#ff6b00] disabled:opacity-30 disabled:hover:text-white transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}