import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Star, Check } from 'lucide-react';

const PropertiesAdmin = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  const fetchProperties = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/properties`);
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setProperties(data);
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const toggleFeatured = async (prop) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/properties/${prop.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ highlights: { ...prop.highlights, featuredProperty: !prop.highlights?.featuredProperty } })
      });
      if (res.ok) fetchProperties();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchProperties();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (property) => {
    setEditingId(property.id);
    setEditPrice(property.pricing?.price || '');
  };

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "pricing.price": editPrice })
      });
      if (res.ok) {
        setEditingId(null);
        fetchProperties();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/properties/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProperties();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Properties</h1>
          <p className="text-slate-500">Manage your real estate listings</p>
        </div>
        <Link 
          to="/properties/add" 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-[0_8px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_25px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 font-bold"
        >
          <Plus className="w-5 h-5" />
          Add Property
        </Link>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden">
        <div className="p-6 border-b border-white/50 bg-white/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search properties..." 
              className="pl-11 pr-4 py-2.5 bg-white/80 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 w-full sm:w-72 shadow-sm transition-all"
            />
          </div>
          <div className="flex gap-2 text-sm text-slate-600 bg-white/60 px-4 py-2 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-white">
            <span className="font-medium">Total:</span> {properties.length}
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading properties...</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white/40 text-slate-500 text-sm border-b border-white/50">
                  <th className="p-5 font-bold w-12 text-center uppercase tracking-wider text-xs">Featured</th>
                  <th className="p-5 font-bold uppercase tracking-wider text-xs">Title</th>
                  <th className="p-5 font-bold uppercase tracking-wider text-xs">Type</th>
                  <th className="p-5 font-bold uppercase tracking-wider text-xs">Purpose</th>
                  <th className="p-5 font-bold uppercase tracking-wider text-xs">Price</th>
                  <th className="p-5 font-bold uppercase tracking-wider text-xs">Status</th>
                  <th className="p-5 font-bold text-right uppercase tracking-wider text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((prop) => (
                  <tr key={prop.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleFeatured(prop)}
                        className={`p-1.5 rounded-full transition-colors ${prop.highlights?.featuredProperty ? 'text-yellow-500 hover:bg-yellow-50' : 'text-slate-300 hover:text-yellow-500 hover:bg-slate-100'}`}
                        title={prop.highlights?.featuredProperty ? "Remove featured" : "Mark as featured"}
                      >
                        <Star className="w-5 h-5" fill={prop.highlights?.featuredProperty ? "currentColor" : "none"} />
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                          {prop.images?.featured ? (
                            <img src={prop.images.featured} alt={prop.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">No img</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 line-clamp-1" title={prop.title}>{prop.title}</p>
                          <p className="text-xs text-slate-500 truncate w-32">ID: {prop.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 text-sm">{prop.type}</td>
                    <td className="p-4 text-slate-600 text-sm">{prop.purpose || 'N/A'}</td>
                    <td className="p-4 text-slate-800 font-medium text-sm">
                      {editingId === prop.id ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="text"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="border border-blue-500 rounded px-2 py-1 text-sm w-32 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <button onClick={() => saveEdit(prop.id)} className="text-green-600 hover:bg-green-50 p-1 rounded">
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>{prop.pricing?.price || 'N/A'}</span>
                          <button 
                            onClick={() => startEdit(prop)}
                            className="text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Edit Price"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <select
                        value={prop.status}
                        onChange={(e) => updateStatus(prop.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer outline-none ${
                          prop.status === 'Active' ? 'bg-green-100 text-green-800' :
                          prop.status === 'Sold' ? 'bg-red-100 text-red-800' :
                          prop.status === 'Rented' ? 'bg-purple-100 text-purple-800' :
                          'bg-slate-100 text-slate-800'
                        }`}
                      >
                        <option value="Active">Active</option>
                        <option value="Sold">Sold</option>
                        <option value="Rented">Rented</option>
                      </select>
                    </td>
                    <td className="p-4 flex items-center justify-end gap-2 transition-opacity">
                      <Link to={`/properties/edit/${prop.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Property">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => deleteProperty(prop.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Property">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesAdmin;
