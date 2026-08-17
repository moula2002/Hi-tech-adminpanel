import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';

const BannersAdmin = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('https://hi-techserver.onrender.com/api/banners');
      const data = await res.json();
      setBanners(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch banners', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!imageFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const res = await fetch('https://hi-techserver.onrender.com/api/banners', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setImageFile(null);
        setPreview(null);
        fetchBanners();
      } else {
        alert('Failed to upload banner');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading banner');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    try {
      const res = await fetch(`https://hi-techserver.onrender.com/api/banners/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchBanners();
      } else {
        alert('Failed to delete banner');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting banner');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Banners</h1>
          <p className="text-slate-500 mt-1">Manage homepage hero banners</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Add New Banner</h2>
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-1 w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-sm text-slate-500"><span className="font-semibold">Click to upload</span></p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>
          {preview && (
            <div className="relative w-full md:w-1/3 h-32 rounded-lg overflow-hidden border border-slate-200">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button 
                onClick={() => { setImageFile(null); setPreview(null); }}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={!imageFile || uploading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Upload Banner
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
            <div className="relative h-48">
              <img src={banner.image} alt="Banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transform hover:scale-110 transition-all shadow-lg"
                  title="Delete Banner"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
            No banners uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default BannersAdmin;
