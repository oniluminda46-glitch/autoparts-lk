"use client";

import React, { useState, useEffect } from "react";

interface Listing {
  id?: number;
  title: string;
  part_name: string;
  make: string;
  model: string;
  year: number;
  price: number;
  condition: string;
  location?: string;
  seller_type?: string;
}

const DEFAULT_ITEMS: Listing[] = [
  {
    id: 1,
    title: "Toyota Aqua 2014 Front Bumper",
    part_name: "Front Bumper",
    make: "Toyota",
    model: "Aqua",
    year: 2014,
    price: 45000,
    condition: "Reconditioned",
    location: "Nugegoda",
    seller_type: "Verified Shop",
  },
  {
    id: 2,
    title: "Honda Civic 2018 LED Headlight (Right)",
    part_name: "Headlight",
    make: "Honda",
    model: "Civic",
    year: 2018,
    price: 85000,
    condition: "Brand New (Aftermarket)",
    location: "Kurunegala",
    seller_type: "Importer",
  },
  {
    id: 3,
    title: "Toyota Vitz 2015 Side Mirror Set",
    part_name: "Side Mirror",
    make: "Toyota",
    model: "Vitz",
    year: 2015,
    price: 28000,
    condition: "Used",
    location: "Pannipitiya",
    seller_type: "Direct Seller",
  },
  {
    id: 4,
    title: "Nissan Leaf 2017 Brake Caliper",
    part_name: "Brake Caliper",
    make: "Nissan",
    model: "Leaf",
    year: 2017,
    price: 32000,
    condition: "Used",
    location: "Kandy",
    seller_type: "Verified Shop",
  },
];

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [listings, setListings] = useState<Listing[]>(DEFAULT_ITEMS);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPostModal, setShowPostModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    part_name: "",
    make: "Toyota",
    model: "Aqua",
    year: 2014,
    price: 45000,
    condition: "Reconditioned",
    location: "Colombo",
    seller_type: "Verified Shop",
  });

  const fetchListings = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/listings");
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setListings(data);
        }
      }
    } catch {
      // Backend not running
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handlePostAd = async (e: React.FormEvent) => {
    e.preventDefault();

    const newPart: Listing = {
      id: Date.now(),
      title: formData.title || `${formData.make} ${formData.model} ${formData.part_name}`,
      part_name: formData.part_name || "Spare Part",
      make: formData.make || "Toyota",
      model: formData.model || "Aqua",
      year: Number(formData.year) || 2014,
      price: Number(formData.price) || 0,
      condition: formData.condition || "Reconditioned",
      location: formData.location || "Colombo",
      seller_type: formData.seller_type || "Verified Shop",
    };

    try {
      await fetch("http://localhost:8080/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPart),
      });
    } catch (err) {
      console.warn("Backend offline, updating UI locally");
    }

    setListings((prev) => [newPart, ...prev]);
    setShowPostModal(false);
  };

  const clearFilters = () => {
    setSelectedMake("");
    setSelectedModel("");
    setSelectedYear("");
    setSearchQuery("");
  };

  const filteredListings = listings.filter((item) => {
    const matchMake = selectedMake ? item.make?.toLowerCase() === selectedMake.toLowerCase() : true;
    const matchModel = selectedModel ? item.model?.toLowerCase() === selectedModel.toLowerCase() : true;
    const matchYear = selectedYear ? item.year?.toString() === selectedYear : true;
    const matchSearch = searchQuery
      ? item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.part_name?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchMake && matchModel && matchYear && matchSearch;
  });

  return (
    <div className={darkMode ? "dark-theme" : "light-theme"}>
      <style jsx global>{`
        :root {
          --bg-color: #F8FAFC;
          --card-bg: #FFFFFF;
          --text-main: #1E293B;
          --text-muted: #64748B;
          --accent: #F97316;
          --accent-hover: #EA580C;
          --border: #E2E8F0;
        }

        .dark-theme {
          --bg-color: #121212;
          --card-bg: #27272A;
          --text-main: #F1F5F9;
          --text-muted: #A1A1AA;
          --accent: #F59E0B;
          --accent-hover: #D97706;
          --border: #3F3F46;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        body { background-color: var(--bg-color); color: var(--text-main); transition: background-color 0.3s, color 0.3s; }

        header { background-color: var(--card-bg); border-bottom: 1px solid var(--border); padding: 15px 5%; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; transition: background-color 0.3s; }
        .logo { font-size: 1.5rem; font-weight: 800; color: var(--text-main); text-decoration: none; }
        .logo span { color: var(--accent); }
        .nav-actions { display: flex; gap: 15px; align-items: center; }
        
        .theme-btn { background: transparent; border: 1px solid var(--border); color: var(--text-main); padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: 0.3s; display: flex; align-items: center; gap: 5px; }
        .theme-btn:hover { background-color: var(--border); }

        .nav-btn { background-color: var(--accent); color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; transition: 0.3s; border: none; cursor: pointer; }
        .nav-btn:hover { background-color: var(--accent-hover); }

        .hero { text-align: center; padding: 50px 20px; background-color: var(--bg-color); }
        .hero h1 { font-size: 2.2rem; margin-bottom: 10px; color: var(--text-main); }
        .hero p { color: var(--text-muted); margin-bottom: 30px; }
        
        .search-box { background-color: var(--card-bg); padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 800px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 10px; border: 1px solid var(--border); transition: background-color 0.3s; }
        .search-box select, .search-box input { flex: 1 1 150px; padding: 12px; border: 1px solid var(--border); border-radius: 6px; background-color: var(--bg-color); color: var(--text-main); outline: none; }
        .search-box button { flex: 1 1 100%; padding: 12px; background-color: var(--accent); color: #fff; border: none; border-radius: 6px; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: 0.3s; }
        .search-box button:hover { background-color: var(--accent-hover); }

        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .section-title { margin-bottom: 20px; font-size: 1.5rem; border-left: 4px solid var(--accent); padding-left: 10px; color: var(--text-main); }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        
        .card { background-color: var(--card-bg); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; transition: transform 0.2s, background-color 0.3s; display: flex; flex-direction: column; }
        .card:hover { transform: translateY(-5px); box-shadow: 0 10px 15px rgba(0,0,0,0.1); }
        .card-img { height: 180px; background-color: var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-size: 0.9rem; transition: background-color 0.3s; text-align: center; padding: 10px; }
        
        .card-content { padding: 15px; display: flex; flex-direction: column; flex-grow: 1; }
        .badge { align-self: flex-start; background-color: var(--border); color: var(--text-main); padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; margin-bottom: 10px; }
        
        .card-title { font-size: 1.1rem; font-weight: bold; margin-bottom: 5px; color: var(--text-main); }
        .card-price { font-size: 1.3rem; font-weight: 800; color: var(--accent); margin-bottom: 10px; }
        .card-meta { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 15px; flex-grow: 1; }
        
        .card-btn { text-align: center; background-color: transparent; color: var(--accent); border: 2px solid var(--accent); padding: 10px; border-radius: 6px; text-decoration: none; font-weight: bold; transition: 0.3s; cursor: pointer; display: block; }
        .card-btn:hover { background-color: var(--accent); color: #fff; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 8px; max-width: 480px; width: 100%; padding: 24px; color: var(--text-main); }
        .modal-card h3 { font-size: 1.3rem; margin-bottom: 15px; }
        .modal-card input, .modal-card select { width: 100%; padding: 10px; margin-bottom: 12px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg-color); color: var(--text-main); outline: none; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
      `}</style>

      {/* Header */}
      <header>
        <a href="#" className="logo">AutoParts<span>LK</span></a>
        <div className="nav-actions">
          <button onClick={() => setDarkMode(!darkMode)} className="theme-btn">
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          <button onClick={() => setShowPostModal(true)} className="nav-btn">Post an Ad</button>
        </div>
      </header>

      {/* Hero & Search */}
      <section className="hero">
        <h1>Find the Exact Part for Your Vehicle</h1>
        <p>Search over 100,000+ spare parts from verified shops and individuals.</p>
        
        <div className="search-box">
          <select value={selectedMake} onChange={(e) => setSelectedMake(e.target.value)}>
            <option value="">Select Make (All)</option>
            <option value="Toyota">Toyota</option>
            <option value="Honda">Honda</option>
            <option value="Nissan">Nissan</option>
          </select>

          <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
            <option value="">Select Model (All)</option>
            <option value="Aqua">Aqua</option>
            <option value="Civic">Civic</option>
            <option value="Vitz">Vitz</option>
            <option value="Leaf">Leaf</option>
          </select>

          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="">Year (All)</option>
            <option value="2018">2018</option>
            <option value="2017">2017</option>
            <option value="2015">2015</option>
            <option value="2014">2014</option>
          </select>

          <input 
            type="text" 
            placeholder="Part Name or OEM No..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button type="button" onClick={clearFilters}>
            Clear Filters / Show All
          </button>
        </div>
      </section>

      {/* Results Grid */}
      <div className="container">
        <h2 className="section-title">Fresh Listings</h2>
        <div className="grid">
          {filteredListings.length === 0 ? (
            <div style={{ textAlign: "center", width: "100%", gridColumn: "1 / -1", padding: "40px", color: "var(--text-muted)" }}>
              <p>No parts found matching your selection.</p>
              <button 
                onClick={clearFilters}
                style={{ marginTop: "12px", padding: "8px 16px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredListings.map((item, index) => (
              <div className="card" key={item.id || index}>
                <div className="card-img">[ {item.part_name || "Part"} Image Placeholder ]</div>
                <div className="card-content">
                  <span className="badge">{item.condition || "Used"}</span>
                  <div className="card-title">{item.title}</div>
                  <div className="card-price">Rs. {Number(item.price).toLocaleString()}</div>
                  <div className="card-meta">
                    📍 {item.location || "Colombo"} • {item.seller_type || "Verified Shop"}
                  </div>
                  <a href="#" className="card-btn" onClick={(e) => e.preventDefault()}>Contact Seller</a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Post Ad Modal with Condition Dropdown */}
      {showPostModal && (
        <div className="modal-overlay" onClick={() => setShowPostModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Post an Auto Part</h3>
            <form onSubmit={handlePostAd}>
              <input
                required
                placeholder="Listing Title (e.g. Toyota Aqua Headlight)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <input
                required
                placeholder="Part Name (e.g. Headlight)"
                value={formData.part_name}
                onChange={(e) => setFormData({ ...formData, part_name: e.target.value })}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  required
                  placeholder="Make"
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                />
                <input
                  required
                  placeholder="Model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="number"
                  placeholder="Year"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2014 })}
                />
                <input
                  type="number"
                  placeholder="Price (LKR)"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                />
              </div>

              {/* Condition Dropdown */}
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              >
                <option value="Reconditioned">Reconditioned</option>
                <option value="Brand New (Aftermarket)">Brand New (Aftermarket)</option>
                <option value="Brand New (Original)">Brand New (Original)</option>
                <option value="Used">Used</option>
              </select>

              <div className="modal-actions">
                <button type="button" className="theme-btn" onClick={() => setShowPostModal(false)}>Cancel</button>
                <button type="submit" className="nav-btn">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}