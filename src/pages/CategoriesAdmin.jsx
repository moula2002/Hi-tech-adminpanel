import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Search, Star, Home, Image as ImageIcon } from 'lucide-react';

const CategoriesAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await fetch('https://hi-techserver.onrender.com/api/categories');
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const deleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`https://hi-techserver.onrender.com/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (id, field, currentValue) => {
    try {
      const res = await fetch(`https://hi-techserver.onrender.com/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !currentValue })
      });
      if (res.ok) fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-slate-500">Manage property categories (e.g. Villas, Apartments)</p>
        </div>
        <Link 
          to="/categories/add" 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-[0_8px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_25px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 font-bold"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </Link>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden">
        
        <div className="p-6 border-b border-white/50 bg-white/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              className="pl-11 pr-4 py-2.5 bg-white/80 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 w-full sm:w-72 shadow-sm transition-all"
            />
          </div>
          <div className="flex gap-2 text-sm text-slate-600 bg-white/60 px-4 py-2 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-white">
            <span className="font-medium">Total:</span> {categories.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No categories found. Add one above!</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white/40 text-slate-500 text-sm border-b border-white/50">
                  <th className="p-5 font-bold w-12 text-center uppercase tracking-wider text-xs">Featured</th>
                  <th className="p-5 font-bold uppercase tracking-wider text-xs">Image</th>
                  <th className="p-5 font-bold uppercase tracking-wider text-xs">Name</th>
                  <th className="p-5 font-bold uppercase tracking-wider text-xs">Slug</th>
                  <th className="p-5 font-bold text-center uppercase tracking-wider text-xs">Home Page</th>
                  <th className="p-5 font-bold text-right uppercase tracking-wider text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleStatus(cat.id, 'featured', cat.featured)}
                        className={`p-1.5 rounded-full transition-colors ${cat.featured ? 'text-yellow-500 hover:bg-yellow-50' : 'text-slate-300 hover:text-yellow-500 hover:bg-slate-100'}`}
                        title={cat.featured ? "Remove featured" : "Mark as featured"}
                      >
                        <Star className="w-5 h-5" fill={cat.featured ? "currentColor" : "none"} />
                      </button>
                    </td>
                    <td className="p-4">
                      {cat.image ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200">
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{cat.name}</p>
                      {cat.shortDescription && <p className="text-xs text-slate-500 truncate w-48">{cat.shortDescription}</p>}
                    </td>
                    <td className="p-4 text-slate-500 text-sm font-medium bg-slate-50/50">
                      /{cat.slug}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleStatus(cat.id, 'showOnHome', cat.showOnHome)}
                        className={`p-1.5 rounded-full transition-colors ${cat.showOnHome ? 'text-blue-500 hover:bg-blue-50' : 'text-slate-300 hover:text-blue-500 hover:bg-slate-100'}`}
                        title={cat.showOnHome ? "Hide from home page" : "Show on home page"}
                      >
                        <Home className="w-5 h-5" fill={cat.showOnHome ? "currentColor" : "none"} />
                      </button>
                    </td>
                    <td className="p-4 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                      <button onClick={() => deleteCategory(cat.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

export default CategoriesAdmin;
