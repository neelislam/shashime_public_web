"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, ChevronRight, X, Search } from "lucide-react";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Navbar specific search states
  const [navSearchQuery, setNavSearchQuery] = useState("");
  const [isNavSearching, setIsNavSearching] = useState(false);
  const searchRef = useRef(null);

  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);

  const closeMenuModal = () => {
    setIsModalOpen(false);
    setSearchQuery("");
  };

  // Fetch all products on mount so search is instant everywhere
  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error("Error fetching menu:", error);
        setProducts(data || []);
      });
  }, []);

  // Listen for the custom event to open the modal from anywhere
  useEffect(() => {
    const handleOpenMenu = () => setIsModalOpen(true);
    window.addEventListener("openMenuModal", handleOpenMenu);

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      window.removeEventListener("openMenuModal", handleOpenMenu);
    };
  }, [isModalOpen]);

  // Close navbar search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsNavSearching(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter products for modal
  const filteredProducts = products.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Filter products for Navbar dropdown
  const navFilteredProducts = products
    .filter(
      (item) =>
        item.name.toLowerCase().includes(navSearchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(navSearchQuery.toLowerCase()),
    )
    .filter((item) => parseFloat(item.price) > 0); // Exclude footer notes for clean search dropdown

  // Group filtered products by Category dynamically for modal
  const groupedProducts = filteredProducts.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(groupedProducts);

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
      {/* 1. THE NAVBAR WITH SEARCH */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 sticky top-0 z-50 bg-[#0b0b0b]/95 backdrop-blur-md border-b border-[#1f1f1f]">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center transition hover:opacity-80"
        >
          <Image
            src="/shashime.png"
            alt="SHASHEME Logo"
            width={160}
            height={40}
            className="h-9 md:h-11 w-auto object-contain"
          />
        </Link>

        {/* Links */}
        <div className="hidden lg:flex items-center gap-7 text-sm font-semibold text-gray-300">
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

        {/* Right side: Navbar Search Bar */}
        <div className="relative" ref={searchRef}>
          <div className="flex items-center bg-[#121212] border border-[#1f1f1f] rounded-full px-3 py-1.5 focus-within:border-[#ff6b00] transition w-44 sm:w-56 md:w-64">
            <Search className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search food..."
              value={navSearchQuery}
              onChange={(e) => {
                setNavSearchQuery(e.target.value);
                setIsNavSearching(true);
              }}
              onFocus={() => setIsNavSearching(true)}
              className="w-full bg-transparent text-white text-xs md:text-sm focus:outline-none placeholder:text-gray-500"
            />
            {navSearchQuery && (
              <button
                onClick={() => setNavSearchQuery("")}
                className="text-gray-500 hover:text-white text-xs ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Live Navbar Search Dropdown Results */}
          {isNavSearching && navSearchQuery.trim() !== "" && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#121212] border border-[#1f1f1f] rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
              <div className="p-3 border-b border-[#1f1f1f] flex justify-between items-center bg-black/40">
                <span className="text-xs font-mono text-gray-400 uppercase">
                  Search Results
                </span>
                <span className="text-xs font-mono text-[#ff6b00]">
                  {navFilteredProducts.length} found
                </span>
              </div>

              {navFilteredProducts.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-xs">
                  No dishes found matching &quot;{navSearchQuery}&quot;
                </div>
              ) : (
                <div className="divide-y divide-[#1f1f1f]">
                  {navFilteredProducts.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setIsNavSearching(false);
                        setNavSearchQuery("");
                        setSearchQuery(item.name);
                        setIsModalOpen(true);
                      }}
                      className="p-3 hover:bg-[#1a1a1a] transition cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-10 h-10 rounded object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-[#1f1f1f] flex items-center justify-center text-[10px] text-gray-500 shrink-0">
                            Food
                          </div>
                        )}
                        <div className="truncate">
                          <p className="text-white text-xs font-bold truncate">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-[#ff6b00] uppercase">
                            {item.category}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-white shrink-0">
                        {item.price} BDT
                      </span>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      setIsNavSearching(false);
                      setSearchQuery(navSearchQuery);
                      setIsModalOpen(true);
                    }}
                    className="w-full py-2.5 text-center text-xs font-bold text-[#ff6b00] hover:bg-[#ff6b00]/10 transition block"
                  >
                    View all in menu modal →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
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
              onClick={closeMenuModal}
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
                  width={140}
                  height={35}
                  className="h-6 md:h-8 object-contain"
                />

                {/* Modal Search Input */}
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
                      setPage(0);
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
                  onClick={closeMenuModal}
                  className="text-gray-400 hover:text-white transition hidden md:block"
                >
                  <X className="w-7 h-7" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 relative flex overflow-hidden">
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

                <div className="flex-1 relative p-6 md:p-10 md:pl-0 overflow-y-auto">
                  {loading && products.length === 0 ? (
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

              {/* Footer */}
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
                  onClick={closeMenuModal}
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
