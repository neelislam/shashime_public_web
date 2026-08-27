'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Make sure this path is correct based on your setup! Use '../lib/supabase' if needed.
import Link from 'next/link';

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // CRUD States
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Mains');
  const [spiciness, setSpiciness] = useState('Medium');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Edit States
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState('Mains');
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
  }, []);

  // --- CRUD OPERATIONS ---

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
      const image_url = await uploadImage(file);
      const { error } = await supabase.from('products').insert([
        { name, price: parseFloat(price), category, spiciness, image_url }
      ]);
      if (error) throw error;
      
      setName(''); setPrice(''); setFile(null);
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
    setEditCategory(item.category || 'Mains');
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

  // --- RENDER ---
  if (authLoading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
  if (!session) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Please refresh and log in.</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-black text-rose-500">Admin Dashboard</h1>
          <Link href="/" className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded text-sm transition">View Live Site</Link>
        </header>

        {/* CREATE SECTION */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 mb-8 shadow-xl">
          <h2 className="text-xl font-bold text-orange-400 mb-4">➕ Add New Menu Item</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Dish Name" value={name} onChange={e => setName(e.target.value)} required className="bg-slate-800 p-3 rounded border border-slate-700 outline-none focus:border-rose-500" />
            <input type="number" step="0.01" placeholder="Price ($)" value={price} onChange={e => setPrice(e.target.value)} required className="bg-slate-800 p-3 rounded border border-slate-700 outline-none focus:border-rose-500" />
            
            <select value={category} onChange={e => setCategory(e.target.value)} className="bg-slate-800 p-3 rounded border border-slate-700 outline-none focus:border-rose-500">
              <option value="Appetizers">Appetizers</option>
              <option value="Mains">Mains</option>
              <option value="Desserts">Desserts</option>
              <option value="Drinks">Drinks</option>
            </select>

            <select value={spiciness} onChange={e => setSpiciness(e.target.value)} className="bg-slate-800 p-3 rounded border border-slate-700 outline-none focus:border-rose-500">
              <option value="Mild">Mild 🔥</option>
              <option value="Medium">Medium 🔥🔥</option>
              <option value="Extra Hot">Extra Hot 🔥🔥🔥</option>
            </select>

            <div className="md:col-span-2">
              <label className="block text-sm text-slate-400 mb-2">Upload Image</label>
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} required className="text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-rose-600 file:text-white hover:file:bg-rose-700" />
            </div>

            <button type="submit" disabled={loading} className="md:col-span-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded mt-2 disabled:opacity-50">
              {loading ? 'Uploading & Saving...' : 'Publish Item'}
            </button>
          </form>
        </div>

        {/* INVENTORY / UPDATE / DELETE SECTION */}
        <h2 className="text-xl font-bold text-slate-200 mb-4">📦 Current Menu Items</h2>
        <div className="grid grid-cols-1 gap-4">
          {products.map(item => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* If Editing */}
              {editingId === item.id ? (
                <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2">
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="bg-slate-700 p-2 rounded" />
                  <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} className="bg-slate-700 p-2 rounded" />
                  <select value={editCategory} onChange={e => setEditCategory(e.target.value)} className="bg-slate-700 p-2 rounded">
                    <option value="Appetizers">Appetizers</option>
                    <option value="Mains">Mains</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(item.id)} className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded flex-1">Save</button>
                    <button onClick={() => setEditingId(null)} className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-2 rounded flex-1">Cancel</button>
                  </div>
                </div>
              ) : (
                /* Normal View */
                <>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    {item.image_url ? (
                       <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded object-cover border border-slate-700" />
                    ) : (
                       <div className="w-16 h-16 rounded bg-slate-800 flex items-center justify-center text-xs text-slate-500">No Img</div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg text-slate-100">{item.name}</h3>
                      <p className="text-sm text-slate-400">
                        ${item.price} • <span className="text-rose-400">{item.category}</span> • {item.spiciness}
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