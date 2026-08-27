import Link from 'next/link';

export default function Gallery() {
  const images = [
    "https://images.unsplash.com/photo-1544025162-8366fd51fa4e?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=600&auto=format&fit=crop"
  ];

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white overflow-x-hidden">


      <div className="px-6 md:px-16 py-16 text-center">
        <h1 className="text-5xl font-serif font-bold text-white mb-6">Food Gallery</h1>
        <p className="text-gray-400 max-w-xl mx-auto mb-16">A visual feast of our most popular and beautifully crafted dishes.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((src, idx) => (
            <div key={idx} className="overflow-hidden rounded-2xl group cursor-pointer border border-[#1f1f1f]">
              <img 
                src={src} 
                alt="Food Gallery" 
                className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-80 group-hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}