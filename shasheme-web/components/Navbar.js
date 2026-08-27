"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch data, lock scrolling, and listen for the custom event
  useEffect(() => {
    const handleOpenMenu = () => setIsModalOpen(true);
    window.addEventListener("openMenuModal", handleOpenMenu);

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      // Only fetch if we haven't loaded the products yet
      if (products.length === 0) {
        queueMicrotask(() => setLoading(true));
        supabase
          .from("products")
          .select("*")
          .order("id", { ascending: true })
          .then(({ data, error }) => {
            if (error) console.error("Error fetching menu:", error);
            setProducts(data || []);
            setLoading(false);
          });
      }
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      window.removeEventListener("openMenuModal", handleOpenMenu);
    };
    // FIXED: Removed products.length from dependencies to prevent the infinite loading loop!
  }, [isModalOpen]);

  // Group products by Category dynamically
  const groupedProducts = products.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(groupedProducts);

  // Pagination Logic (Show 2 Categories per page)
  const catsPerPage = 2;
  const totalPages = Math.ceil(categories.length / catsPerPage);
  const currentCats = categories.slice(
    page * catsPerPage,
    (page + 1) * catsPerPage,
  );

  const changePage = (newDirection) => {
    setDirection(newDirection);
    setPage((prev) => prev + newDirection);
  };

  return (
    <>
      {/* 1. THE NAVBAR */}
      <nav className="flex items-center justify-between px-6 md:px-16 py-6 sticky top-0 z-50 bg-[#0b0b0b]/90 backdrop-blur-md border-b border-[#1f1f1f]">
        <Link
          href="/"
          className="flex items-center transition hover:opacity-80"
        >
          <Image
            src="/shashime.png"
            alt="SHASHEME Logo"
            width={192}
            height={48}
            className="h-10 md:h-12 w-auto object-contain"
          />
        </Link>

        <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-300">
          <Link href="/" className="hover:text-[#ff6b00] transition">
            Home
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="hover:text-[#ff6b00] transition cursor-pointer"
          >
            Menu
          </button>
          <Link href="/about" className="hover:text-[#ff6b00] transition">
            About Us
          </Link>
          <Link href="/gallery" className="hover:text-[#ff6b00] transition">
            Gallery
          </Link>
          <Link href="/contact" className="hover:text-[#ff6b00] transition">
            Contact
          </Link>
          <Link
            href="/custom-order"
            className="hover:text-[#ff6b00] transition"
          >
            Customized Order
          </Link>
        </div>

        <div className="hidden md:block w-[72px]"></div>
      </nav>

      {/* 2. THE TYPOGRAPHIC MENU MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6">
            {/* Dark Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Box - Pure Black like the JPEGs */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-5xl bg-black border border-[#1f1f1f] flex flex-col h-[90vh] overflow-hidden"
            >
              {/* Header inside Modal */}
              <div className="flex justify-between items-center p-4 md:p-6 pb-0 z-10">
                <img
                  src="/shashime.png"
                  alt="Shashime"
                  className="h-6 md:h-10 object-contain"
                />
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X className="w-6 h-6 md:w-8 md:h-8" />
                </button>
              </div>

              {/* Body: Animated Book Pages */}
              <div className="flex-1 relative flex overflow-hidden">
                {/* Left Side: Vertical Menu Text (Hidden on mobile) */}
                <div className="hidden md:flex w-32 items-end justify-center pb-24 z-10 pointer-events-none">
                  <h2
                    className="text-7xl text-gray-200 -rotate-90 origin-center whitespace-nowrap opacity-90"
                    style={{ fontFamily: "cursive" }}
                  >
                    Menu
                  </h2>
                </div>

                {/* Right Side: Dynamic Category Data */}
                <div className="flex-1 relative p-6 md:p-10 md:pl-0">
                  {loading ? (
                    <div className="flex justify-center items-center h-full text-[#ff6b00]">
                      Loading menu...
                    </div>
                  ) : products.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-gray-500">
                      The menu is empty. Add items in the Admin panel!
                    </div>
                  ) : (
                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.div
                        key={page}
                        custom={direction}
                        initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full p-6 md:p-10 md:pl-0 overflow-y-auto space-y-12"
                      >
                        {currentCats.map((cat) => (
                          <div key={cat}>
                            {/* Category Title */}
                            <h3 className="font-mono text-xl md:text-2xl text-white uppercase tracking-widest mb-6">
                              {cat}
                            </h3>

                            {/* Items List */}
                            <ul className="space-y-3">
                              {groupedProducts[cat].map((item) => {
                                // Our smart trick: If price is 0, render it as the pinkish-red footer note
                                const isNote = parseFloat(item.price) === 0;

                                return (
                                  <li
                                    key={item.id}
                                    className={
                                      isNote
                                        ? "text-[#d64057] mt-6 font-mono uppercase text-sm tracking-wider"
                                        : "flex items-start gap-3"
                                    }
                                  >
                                    {!isNote && (
                                      <span className="mt-2 w-1.5 h-1.5 bg-gray-300 rounded-full inline-block shrink-0" />
                                    )}

                                    {!isNote ? (
                                      <span className="text-gray-300 leading-relaxed text-sm md:text-base">
                                        {item.name}
                                        {/* Standardized Price formatting */}
                                        <span className="ml-2 font-bold">
                                          — {item.price} BDT
                                        </span>
                                      </span>
                                    ) : (
                                      <span>{item.name}</span>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </div>

              {/* Footer: Slide Arrows */}
              <div className="p-4 md:p-8 flex justify-between items-center z-10">
                <button
                  onClick={() => changePage(-1)}
                  disabled={page === 0}
                  className="p-2 text-gray-500 hover:text-white disabled:opacity-30 transition"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>

                <span className="text-gray-600 font-mono tracking-widest text-xs uppercase">
                  Page {page + 1} of {totalPages || 1}
                </span>

                <button
                  onClick={() => changePage(1)}
                  disabled={page === totalPages - 1 || totalPages === 0}
                  className="p-2 text-gray-500 hover:text-white disabled:opacity-30 transition"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
