import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Info, Image as ImageIcon, Settings, Search, CheckSquare } from 'lucide-react';

const AddCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: null,
    icon: null,
    description: '',
    shortDescription: '',
    showOnHome: false,
    featured: false,
    seo: { metaTitle: '', metaDescription: '' }
  });

  const [slugEdited, setSlugEdited] = useState(false);
  
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
        .then(res => res.json())
        .then(data => {
          const category = data.find(c => c.id === id);
          if (category) {
            setFormData({
              name: category.name || '',
              slug: category.slug || '',
              image: null,
              icon: null,
              description: category.description || '',
              shortDescription: category.shortDescription || '',
              showOnHome: category.showOnHome || false,
              featured: category.featured || false,
              seo: category.seo || { metaTitle: '', metaDescription: '' }
            });
            setSlugEdited(true);
          } else {
            setErrorMsg('Category not found.');
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setErrorMsg('Failed to fetch category details.');
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    if (!slugEdited && formData.name) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name, slugEdited]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || (!id && !formData.image)) {
      setErrorMsg('Please fill out all required (*) fields.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('slug', formData.slug);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('shortDescription', formData.shortDescription);
      formDataToSend.append('showOnHome', formData.showOnHome);
      formDataToSend.append('featured', formData.featured);
      formDataToSend.append('seo', JSON.stringify(formData.seo));
      
      if (formData.image) formDataToSend.append('image', formData.image);
      if (formData.icon) formDataToSend.append('icon', formData.icon);

      const url = id ? `${import.meta.env.VITE_API_BASE_URL}/api/categories/${id}` : `${import.meta.env.VITE_API_BASE_URL}/api/categories`;
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method: method,
        body: formDataToSend // Let browser set multipart/form-data headers automatically
      });

      if (res.ok) {
        navigate('/categories');
      } else {
        const err = await res.json();
        setErrorMsg(err.message || 'Failed to save category');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Server connection failed.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/categories')}
          className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{id ? 'Edit Category' : 'Add New Category'}</h1>
          <p className="text-slate-500 mt-1">{id ? 'Update the details below.' : 'Create a new property category (e.g., Villas, Apartments).'}</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 shadow-sm animate-in fade-in">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Basic Details */}
        <section className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Info className="text-blue-500 w-6 h-6" /> 1. Basic Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Category Name *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Villas, Apartments, Plots" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Category Slug (Auto Generated)</label>
              <input type="text" value={formData.slug} onChange={(e) => { setFormData({...formData, slug: e.target.value}); setSlugEdited(true); }} placeholder="villas, apartments" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-500" />
            </div>
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Category Image (Upload) {id ? '(Optional - Leave empty to keep existing)' : '*'}</label>
              <input type="file" accept="image/*" onChange={(e) => setFormData({...formData, image: e.target.files[0]})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Category Icon (Upload, Optional)</label>
              <input type="file" accept="image/*" onChange={(e) => setFormData({...formData, icon: e.target.files[0]})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Short Description</label>
              <textarea value={formData.shortDescription} onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} rows="2" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"></textarea>
            </div>
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Full Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="4" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"></textarea>
            </div>
          </div>
        </section>

        {/* 2. Display Settings */}
        <section className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Settings className="text-blue-500 w-6 h-6" /> 2. Display Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="checkbox" checked={formData.showOnHome} onChange={(e) => setFormData({...formData, showOnHome: e.target.checked})} className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
              <span className="font-medium text-slate-800">Show on Home Page</span>
            </label>
            <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
              <span className="font-medium text-slate-800">Featured Category</span>
            </label>
          </div>
        </section>

        {/* 3. SEO Settings */}
        <section className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Search className="text-blue-500 w-6 h-6" /> 3. SEO (Optional)
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Meta Title</label>
              <input type="text" value={formData.seo.metaTitle} onChange={(e) => setFormData({...formData, seo: {...formData.seo, metaTitle: e.target.value}})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Meta Description</label>
              <textarea value={formData.seo.metaDescription} onChange={(e) => setFormData({...formData, seo: {...formData.seo, metaDescription: e.target.value}})} rows="3" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"></textarea>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-4 sticky bottom-6 z-10 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl">
          <button 
            type="button"
            onClick={() => navigate('/categories')}
            className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
          >
            <Save className="w-5 h-5" />
            {loading ? (id ? 'Updating Category...' : 'Saving Category...') : (id ? 'Update Category' : 'Save Category')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
