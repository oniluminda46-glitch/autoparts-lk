"use client";

import { useEffect, useState } from "react";

interface Listing {
  id: number;
  title: string;
  part_name: string;
  make: string;
  model: string;
  year: number;
  price: number;
  condition: string;
  district: string;
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [form, setForm] = useState({
    title: "",
    part_name: "",
    make: "",
    model: "",
    year: 2020,
    price: 0,
    condition: "Used",
    district: "Colombo",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchListings = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/listings");
      const data = await res.json();
      setListings(data || []);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      year: Number(form.year),
      price: Number(form.price),
    };

    if (editingId) {
      await fetch(`http://localhost:8080/api/listings/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setEditingId(null);
    } else {
      await fetch("http://localhost:8080/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setForm({
      title: "",
      part_name: "",
      make: "",
      model: "",
      year: 2020,
      price: 0,
      condition: "Used",
      district: "Colombo",
    });
    fetchListings();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    await fetch(`http://localhost:8080/api/listings/${id}`, {
      method: "DELETE",
    });
    fetchListings();
  };

  const handleEdit = (item: Listing) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      part_name: item.part_name,
      make: item.make,
      model: item.model,
      year: item.year,
      price: item.price,
      condition: item.condition,
      district: item.district,
    });
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="border-b border-slate-700 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-orange-500">AutoPartsLK Management</h1>
            <p className="text-sm text-slate-400">Go (Gin) REST API + Next.js CRUD Integration</p>
          </div>
          <span className="px-3 py-1 bg-green-900/50 text-green-400 border border-green-600 text-xs rounded-full">
            Backend: Connected (8080)
          </span>
        </header>

        <section className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-200">
            {editingId ? "Update Part Listing" : "Add New Part Listing"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Title"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="bg-slate-900 border border-slate-600 rounded p-2 text-sm focus:outline-orange-500"
            />
            <input
              type="text"
              placeholder="Part Name"
              required
              value={form.part_name}
              onChange={(e) => setForm({ ...form, part_name: e.target.value })}
              className="bg-slate-900 border border-slate-600 rounded p-2 text-sm focus:outline-orange-500"
            />
            <input
              type="text"
              placeholder="Make (e.g. Toyota)"
              required
              value={form.make}
              onChange={(e) => setForm({ ...form, make: e.target.value })}
              className="bg-slate-900 border border-slate-600 rounded p-2 text-sm focus:outline-orange-500"
            />
            <input
              type="text"
              placeholder="Model (e.g. Aqua)"
              required
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              className="bg-slate-900 border border-slate-600 rounded p-2 text-sm focus:outline-orange-500"
            />
            <input
              type="number"
              placeholder="Year"
              required
              value={form.year}
              onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
              className="bg-slate-900 border border-slate-600 rounded p-2 text-sm focus:outline-orange-500"
            />
            <input
              type="number"
              placeholder="Price (LKR)"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="bg-slate-900 border border-slate-600 rounded p-2 text-sm focus:outline-orange-500"
            />
            <select
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
              className="bg-slate-900 border border-slate-600 rounded p-2 text-sm focus:outline-orange-500"
            >
              <option value="Brand New">Brand New</option>
              <option value="Used">Used</option>
              <option value="Reconditioned">Reconditioned</option>
            </select>
            <input
              type="text"
              placeholder="District (e.g. Colombo)"
              required
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              className="bg-slate-900 border border-slate-600 rounded p-2 text-sm focus:outline-orange-500"
            />
            <div className="md:col-span-4 flex gap-2 justify-end mt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm font-medium"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2 bg-orange-600 hover:bg-orange-500 rounded text-sm font-semibold text-white shadow"
              >
                {editingId ? "Save Changes" : "Create Listing"}
              </button>
            </div>
          </form>
        </section>

        <section className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-md">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Title</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Part</th>
                <th className="p-4">Price</th>
                <th className="p-4">District</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 text-slate-300">
              {listings.map((item) => (
                <tr key={item.id} className="hover:bg-slate-750/50">
                  <td className="p-4 font-mono text-slate-500">{item.id}</td>
                  <td className="p-4 font-medium text-white">{item.title}</td>
                  <td className="p-4">{item.make} {item.model} ({item.year})</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-slate-700 rounded text-xs">
                      {item.part_name} - {item.condition}
                    </span>
                  </td>
                  <td className="p-4 text-orange-400 font-semibold">LKR {item.price.toLocaleString()}</td>
                  <td className="p-4 text-slate-400">{item.district}</td>
                  <td className="p-4 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 bg-blue-600/30 text-blue-400 border border-blue-500 rounded hover:bg-blue-600 hover:text-white text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 bg-red-600/30 text-red-400 border border-red-500 rounded hover:bg-red-600 hover:text-white text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {listings.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No listings found. Make sure your Go server is running on port 8080!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}