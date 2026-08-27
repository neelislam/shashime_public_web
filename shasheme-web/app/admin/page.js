"use client";

import { useState, useEffect } from "react";
import { supabase } from '../../lib/supabase';
import Link from "next/link";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [spiciness, setSpiciness] = useState("Medium");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editSpiciness, setEditSpiciness] = useState("Medium");

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts(data || []);
  };

  useEffect(() => {
    const timeoutId = setTimeout(fetchProducts, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  // Upload image to Supabase Storage
  const uploadImage = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `items/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("food-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("food-images")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  // CREATE Product
  const handleCreate = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let image_url = null;
      if (file) {
        image_url = await uploadImage(file);
      }

      const { error } = await supabase
        .from("products")
        .insert([{ name, price: parseFloat(price), spiciness, image_url }]);

      if (error) throw error;

      setName("");
      setPrice("");
      setSpiciness("Medium");
      setFile(null);
      fetchProducts();
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  // UPDATE Product (Rename / Edit)
  const handleUpdate = async (id) => {
    const { error } = await supabase
      .from("products")
      .update({
        name: editName,
        price: parseFloat(editPrice),
        spiciness: editSpiciness,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
    } else {
      setEditingId(null);
      fetchProducts();
    }
  };

  // DELETE Product
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) alert(error.message);
    else fetchProducts();
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditPrice(item.price);
    setEditSpiciness(item.spiciness);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-rose-500">
            SHASHEME Admin Panel
          </h1>
          <Link href="/" className="text-slate-400 hover:text-white text-sm">
            ← Back to Live Menu
          </Link>
        </div>

        {/* Create Form */}
        <form
          onSubmit={handleCreate}
          className="bg-slate-900 p-6 rounded-xl border border-slate-800 mb-10 space-y-4"
        >
          <h2 className="text-xl font-semibold text-orange-400">
            Add New Spicy Item
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Dish Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-slate-800 border border-slate-700 rounded p-2 text-white"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="bg-slate-800 border border-slate-700 rounded p-2 text-white"
            />
            <select
              value={spiciness}
              onChange={(e) => setSpiciness(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded p-2 text-white"
            >
              <option value="Mild">Mild 🔥</option>
              <option value="Medium">Medium 🔥🔥</option>
              <option value="Extra Hot">Extra Hot 🔥🔥🔥</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Upload Food Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="text-sm text-slate-400"
            />
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="bg-rose-600 hover:bg-rose-700 px-6 py-2 rounded text-white font-semibold disabled:opacity-50"
          >
            {uploading ? "Adding..." : "Add Item"}
          </button>
        </form>

        {/* Inventory List */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h2 className="text-xl font-semibold text-slate-200 mb-4">
            Manage Items
          </h2>
          <div className="space-y-4">
            {products.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4"
              >
                {editingId === item.id ? (
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-slate-700 p-2 rounded text-white"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="bg-slate-700 p-2 rounded text-white"
                    />
                    <select
                      value={editSpiciness}
                      onChange={(e) => setEditSpiciness(e.target.value)}
                      className="bg-slate-700 p-2 rounded text-white"
                    >
                      <option value="Mild">Mild 🔥</option>
                      <option value="Medium">Medium 🔥🔥</option>
                      <option value="Extra Hot">Extra Hot 🔥🔥🔥</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt=""
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-slate-100">{item.name}</h3>
                      <p className="text-sm text-slate-400">
                        ${item.price} • {item.spiciness}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {editingId === item.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(item.id)}
                        className="bg-green-600 px-3 py-1 rounded text-xs font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-slate-600 px-3 py-1 rounded text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(item)}
                        className="bg-blue-600 px-3 py-1 rounded text-xs font-bold"
                      >
                        Edit / Rename
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-600 px-3 py-1 rounded text-xs font-bold"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
