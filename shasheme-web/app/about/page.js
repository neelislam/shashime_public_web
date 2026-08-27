import Link from 'next/link';

export default function About() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white overflow-x-hidden">


      <section className="px-6 md:px-16 py-24 flex flex-col md:flex-row items-center gap-16">
        <div className="md:w-1/2">
          <img 
            src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=1000&auto=format&fit=crop" 
            alt="Chef cooking" 
            className="w-full rounded-2xl shadow-2xl border border-[#1f1f1f]"
          />
        </div>
        <div className="md:w-1/2">
          <p className="text-[#ff6b00] font-bold text-sm tracking-widest uppercase mb-4">Our Story</p>
          <h1 className="text-5xl font-serif font-bold text-white mb-6">Mastering the Art of Spice</h1>
          <p className="text-gray-400 text-lg mb-6 leading-relaxed">
            At SHASHEME, we believe that food is more than just fuel—its an experience. Born out of a passion for bold flavors and street-style authenticity, our kitchen blends traditional recipes with modern culinary techniques.
          </p>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Every dish that leaves our kitchen is a testament to our commitment to quality, featuring hand-picked ingredients, custom spice blends, and a whole lot of love.
          </p>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-black text-[#ff6b00]">10+</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Expert Chefs</p>
            </div>
            <div className="w-[1px] h-12 bg-[#1f1f1f]"></div>
            <div className="text-center">
              <p className="text-3xl font-black text-[#ff6b00]">50+</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Unique Dishes</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}