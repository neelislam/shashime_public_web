'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminPage() {
  // Auth States
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(true);

  // CRUD States
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [spiciness, setSpiciness] = useState('Medium');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Edit States
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editSpiciness, setEditSpiciness] = useState('Medium');

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      if (session) fetchProducts();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProducts();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Get unique categories to help Admin with auto-complete suggestions
  const existingCategories = [...new Set(products.map(p => p.category))].filter(Boolean);

  const uploadImage = async (imageFile) => {
    if (!imageFile) return null;
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `food/${fileName}`;
    
    const { error } = await supabase.storage.from('food-images').upload(filePath, imageFile);
    if (error) throw error;
    
    const { data } = supabase.storage.from('food-images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Image is now optional so the admin can add the red footer text
      const image_url = file ? await uploadImage(file) : null;
      
      const { error } = await supabase.from('products').insert([
        { name, price: parseFloat(price), category, spiciness, image_url }
      ]);
      if (error) throw error;
      
      setName(''); setPrice(''); setCategory(''); setFile(null);
      fetchProducts();
      alert("Item added successfully!");
    } catch (err) {
      alert("Error adding item: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditPrice(item.price);
    setEditCategory(item.category || '');
    setEditSpiciness(item.spiciness);
  };

  const handleUpdate = async (id) => {
    const { error } = await supabase.from('products')
      .update({ name: editName, price: parseFloat(editPrice), category: editCategory, spiciness: editSpiciness })
      .eq('id', id);
      
    if (error) alert(error.message);
    else {
      setEditingId(null);
      fetchProducts();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item permanently?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchProducts();
  };

  if (authLoading) return <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">Loading...</div>;

  // LOGIN SCREEN
  if (!session) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="bg-[#121212] p-8 rounded-xl border border-[#1f1f1f] w-full max-w-md space-y-4 shadow-xl text-center">
          <h1 className="text-3xl font-black text-[#ff6b00] mb-6">SHASHEME Admin</h1>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-[#0b0b0b] border border-[#1f1f1f] rounded p-3 text-white focus:outline-none focus:border-[#ff6b00] transition" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-[#0b0b0b] border border-[#1f1f1f] rounded p-3 text-white focus:outline-none focus:border-[#ff6b00] transition" />
          <button type="submit" className="w-full bg-[#ff6b00] hover:bg-[#e65c00] py-3 rounded text-white font-bold transition">Log In</button>
          <Link href="/" className="block mt-4 text-gray-500 hover:text-white text-sm">Return to Menu</Link>
        </form>
      </div>
    );
  }

  // ADMIN DASHBOARD SCREEN
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-slate-100 p-6 pt-24">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-[#1f1f1f] pb-4 gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#ff6b00]">Admin Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">Logged in as {session.user.email}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={handleLogout} className="text-gray-400 hover:text-white text-sm transition">Log Out</button>
            <Link href="/" className="bg-[#121212] hover:bg-[#1f1f1f] border border-[#1f1f1f] px-4 py-2 rounded text-sm text-white transition">View Live Site</Link>
          </div>
        </header>

        {/* CREATE SECTION */}
        <div className="bg-[#121212] p-6 rounded-xl border border-[#1f1f1f] mb-8 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">➕ Add New Menu Item</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Dish Name (or Footer Text)" value={name} onChange={e => setName(e.target.value)} required className="bg-[#0b0b0b] p-3 rounded border border-[#1f1f1f] outline-none focus:border-[#ff6b00] text-white" />
            
            {/* The Price determines if it's normal text or red footer text! */}
            <input type="number" step="0.01" placeholder="Price (Use 0 for red footer text)" value={price} onChange={e => setPrice(e.target.value)} required className="bg-[#0b0b0b] p-3 rounded border border-[#1f1f1f] outline-none focus:border-[#ff6b00] text-white" />
            
            {/* Dynamic Category Input with Smart Suggestions */}
            <div>
              <input 
                list="category-suggestions" 
                type="text" 
                placeholder="Category (e.g. SEA_FOOD_BOIL_1:1)" 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                required 
                className="w-full bg-[#0b0b0b] p-3 rounded border border-[#1f1f1f] outline-none focus:border-[#ff6b00] text-white" 
              />
              <datalist id="category-suggestions">
                {existingCategories.map(cat => <option key={cat} value={cat} />)}
              </datalist>
            </div>

            <select value={spiciness} onChange={e => setSpiciness(e.target.value)} className="bg-[#0b0b0b] p-3 rounded border border-[#1f1f1f] outline-none focus:border-[#ff6b00] text-white">
              <option value="None">None</option>
              <option value="Mild">Mild 🔥</option>
              <option value="Medium">Medium 🔥🔥</option>
              <option value="Extra Hot">Extra Hot 🔥🔥🔥</option>
            </select>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Upload Image (Optional for red text)</label>
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#ff6b00] file:text-white hover:file:bg-[#e65c00]" />
            </div>

            <button type="submit" disabled={loading} className="md:col-span-2 bg-[#ff6b00] hover:bg-[#e65c00] text-white font-bold py-3 rounded mt-2 disabled:opacity-50 transition">
              {loading ? 'Uploading & Saving...' : 'Publish Item'}
            </button>
          </form>
        </div>

        {/* INVENTORY / UPDATE / DELETE SECTION */}
        <h2 className="text-xl font-bold text-slate-200 mb-4">📦 Current Menu Items</h2>
        <div className="grid grid-cols-1 gap-4">
          {products.map(item => (
            <div key={item.id} className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {editingId === item.id ? (
                <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2">
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="bg-[#0b0b0b] text-white p-2 border border-[#1f1f1f] rounded" />
                  <input type="number" step="0.01" value={editPrice} onChange={e => setEditPrice(e.target.value)} className="bg-[#0b0b0b] text-white p-2 border border-[#1f1f1f] rounded" />
                  
                  {/* Edit Category dynamically */}
                  <input list="category-suggestions" type="text" value={editCategory} onChange={e => setEditCategory(e.target.value)} className="bg-[#0b0b0b] text-white p-2 border border-[#1f1f1f] rounded" />
                  
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(item.id)} className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded flex-1">Save</button>
                    <button onClick={() => setEditingId(null)} className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded flex-1">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    {item.image_url ? (
                       <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded object-cover border border-[#1f1f1f]" />
                    ) : (
                       <div className="w-16 h-16 rounded bg-[#1a1a1a] flex items-center justify-center text-xs text-gray-500">No Img</div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg text-white">{item.name}</h3>
                      <p className="text-sm text-gray-400">
                        {parseFloat(item.price) === 0 ? "Footer Text (0 BDT)" : `$${item.price}`} • <span className="text-[#ff6b00]">{item.category}</span> • {item.spiciness}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                    <button onClick={() => startEdit(item)} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm font-bold text-white flex-1 md:flex-none">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded text-sm font-bold text-white flex-1 md:flex-none">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}