'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      // Fetch only items that have an image uploaded by the admin
      const { data } = await supabase
        .from('products')
        .select('image_url, name')
        .not('image_url', 'is', null)
        .order('created_at', { ascending: false });
        
      setImages(data || []);
      setLoading(false);
    };
    fetchImages();
  }, []);

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white overflow-x-hidden pb-24">
      <div className="px-6 md:px-16 py-16 text-center pt-24">
        <h1 className="text-5xl font-serif font-bold text-white mb-6">Food Gallery</h1>
        <p className="text-gray-400 max-w-xl mx-auto mb-16">A visual feast of our dishes. Everything you see here is fresh from our kitchen.</p>
        
        {loading ? (
          <p className="text-[#ff6b00]">Loading gallery...</p>
        ) : images.length === 0 ? (
          <p className="text-gray-500">No images have been uploaded to the menu yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((item, idx) => (
              <div key={idx} className="overflow-hidden rounded-2xl group cursor-pointer border border-[#1f1f1f] relative">
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-80 group-hover:opacity-100"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-bold">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}