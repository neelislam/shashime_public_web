"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, ChevronRight, X, Search } from "lucide-react";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);

  const closeMenu = () => {
    setSearchQuery("");
    setIsModalOpen(false);
  };

  // Fetch data, lock scrolling, and listen for the custom event
  useEffect(() => {
    const handleOpenMenu = () => setIsModalOpen(true);
    window.addEventListener("openMenuModal", handleOpenMenu);

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
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
  }, [isModalOpen, products.length]);

  // 1. Filter products based on search input
  const filteredProducts = products.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // 2. Group filtered products by Category dynamically
  const groupedProducts = filteredProducts.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(groupedProducts);

  // Pagination Logic (Show 2 Categories per page when NOT searching)
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

      {/* 2. THE TYPOGRAPHIC MENU MODAL WITH SEARCH */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6">
            {/* Dark Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-5xl bg-black border border-[#1f1f1f] flex flex-col h-[92vh] overflow-hidden rounded-2xl shadow-2xl"
            >
              {/* Header inside Modal with Logo, Search Bar, and Close Button */}
              <div className="flex flex-col md:flex-row justify-between items-center p-4 md:p-6 border-b border-[#1f1f1f] gap-4 z-10 bg-black">
                <Image
                  src="/shashime.png"
                  alt="Shashime"
                  width={160}
                  height={40}
                  className="h-6 md:h-10 object-contain"
                />

                {/* Professional Search Input */}
                <div className="relative w-full md:w-80">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search dishes or categories..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(0); // Reset pagination on search
                    }}
                    className="w-full bg-[#121212] text-white text-sm rounded-full pl-9 pr-4 py-2 border border-[#1f1f1f] focus:outline-none focus:border-[#ff6b00] transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-500 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  onClick={closeMenu}
                  className="text-gray-400 hover:text-white transition hidden md:block"
                >
                  <X className="w-7 h-7" />
                </button>
              </div>

              {/* Body: Animated Book Pages or Live Search Results */}
              <div className="flex-1 relative flex overflow-hidden">
                {/* Left Side: Vertical Menu Text (Hidden on mobile or when searching) */}
                {!searchQuery && (
                  <div className="hidden md:flex w-28 items-end justify-center pb-24 z-10 pointer-events-none">
                    <h2
                      className="text-6xl text-gray-200 -rotate-90 origin-center whitespace-nowrap opacity-90"
                      style={{ fontFamily: "cursive" }}
                    >
                      Menu
                    </h2>
                  </div>
                )}

                {/* Right Side: Dynamic Data */}
                <div className="flex-1 relative p-6 md:p-10 md:pl-0 overflow-y-auto">
                  {loading ? (
                    <div className="flex justify-center items-center h-full text-[#ff6b00]">
                      Loading menu...
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
                      <p>No dishes found matching &quot;{searchQuery}&quot;</p>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="text-xs text-[#ff6b00] underline"
                      >
                        Clear search
                      </button>
                    </div>
                  ) : searchQuery ? (
                    /* Instant Search Results Layout (Shows all matches smoothly) */
                    <div className="space-y-8 pr-2">
                      <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                        Found{" "}
                        {
                          filteredProducts.filter(
                            (p) => parseFloat(p.price) > 0,
                          ).length
                        }{" "}
                        results for &quot;{searchQuery}&quot;
                      </p>
                      {categories.map((cat) => (
                        <div key={cat}>
                          <h3 className="font-mono text-lg text-[#ff6b00] uppercase tracking-widest mb-4">
                            {cat}
                          </h3>
                          <ul className="space-y-3">
                            {groupedProducts[cat].map((item) => {
                              const isNote = parseFloat(item.price) === 0;
                              return (
                                <li
                                  key={item.id}
                                  className={
                                    isNote
                                      ? "text-[#d64057] mt-4 font-mono uppercase text-sm tracking-wider"
                                      : "flex items-start gap-3"
                                  }
                                >
                                  {!isNote && (
                                    <span className="mt-2 w-1.5 h-1.5 bg-[#ff6b00] rounded-full inline-block shrink-0" />
                                  )}
                                  {!isNote ? (
                                    <span className="text-gray-300 leading-relaxed text-sm md:text-base">
                                      {item.name}
                                      <span className="ml-2 font-bold text-white">
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
                    </div>
                  ) : (
                    /* Default Page-by-Page Book Layout */
                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.div
                        key={page}
                        custom={direction}
                        initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full p-6 md:p-10 md:pl-0 overflow-y-auto space-y-10"
                      >
                        {currentCats.map((cat) => (
                          <div key={cat}>
                            <h3 className="font-mono text-xl md:text-2xl text-white uppercase tracking-widest mb-6">
                              {cat}
                            </h3>
                            <ul className="space-y-3">
                              {groupedProducts[cat].map((item) => {
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

              {/* Footer: Slide Arrows (Hidden during active search for cleaner UX) */}
              <div className="p-4 md:p-6 border-t border-[#1f1f1f] flex justify-between items-center z-10 bg-black">
                {!searchQuery ? (
                  <>
                    <button
                      onClick={() => changePage(-1)}
                      disabled={page === 0}
                      className="p-2 text-gray-500 hover:text-white disabled:opacity-30 transition cursor-pointer"
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </button>

                    <span className="text-gray-600 font-mono tracking-widest text-xs uppercase">
                      Page {page + 1} of {totalPages || 1}
                    </span>

                    <button
                      onClick={() => changePage(1)}
                      disabled={page === totalPages - 1 || totalPages === 0}
                      className="p-2 text-gray-500 hover:text-white disabled:opacity-30 transition cursor-pointer"
                    >
                      <ChevronRight className="w-8 h-8" />
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-mono text-gray-500">
                    Showing instant filter results
                  </span>
                )}

                <button
                  onClick={closeMenu}
                  className="text-xs text-gray-400 hover:text-white md:hidden"
                >
                  Close Menu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
