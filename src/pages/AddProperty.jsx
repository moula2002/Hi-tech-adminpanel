import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, MapPin, Building, Image as ImageIcon, AlignLeft, Info, Settings, Search, CheckSquare, Users } from 'lucide-react';

const AddProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [existingImages, setExistingImages] = useState({ featured: null, gallery: [] });

  const AMENITIES_LIST = [
    'Swimming Pool', 'Gym', 'Lift', 'Security', 'CCTV', 'Power Backup',
    'Garden', 'Club House', "Children's Play Area", 'WiFi', 'Water Supply'
  ];

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Residential',
    type: '',
    purpose: 'Sale',
    status: 'Available',
    pricing: { price: '', offerPrice: '', pricePerSqFt: '', maintenanceCharges: '' },
    location: { state: '', city: '', area: '', fullAddress: '', pincode: '', googleMapLink: '' },
    specifications: { totalArea: '', builtUpArea: '', bedrooms: '', bathrooms: '', balconies: '', floors: '', parkingSpaces: '', facing: '' },
    amenities: [],
    images: { featured: null, gallery: [], videoUrl: '' },
    description: { short: '', full: '' },
    highlights: { readyToMove: false, newLaunch: false, premiumProperty: false, featuredProperty: false, hotProperty: false },
    
    seo: { metaTitle: '', metaDescription: '', metaKeywords: '' }
  });

  // Auto-generate slug when title changes, if slug is not manually edited
  const [slugEdited, setSlugEdited] = useState(false);
  
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/properties/${id}`)
        .then(res => res.json())
        .then(data => {
          setExistingImages({
            featured: data.images?.featured || null,
            gallery: data.images?.gallery || []
          });
          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            type: data.type || '',
            purpose: data.purpose || 'Sale',
            status: data.status || 'Available',
            pricing: data.pricing || { price: '', offerPrice: '', pricePerSqFt: '', maintenanceCharges: '' },
            location: data.location || { state: '', city: '', area: '', fullAddress: '', pincode: '', googleMapLink: '' },
            specifications: data.specifications || { totalArea: '', builtUpArea: '', bedrooms: '', bathrooms: '', balconies: '', floors: '', parkingSpaces: '', facing: '' },
            amenities: data.amenities || [],
            images: { featured: null, gallery: [], videoUrl: data.images?.videoUrl || '' },
            description: data.description || { short: '', full: '' },
            highlights: data.highlights || { readyToMove: false, newLaunch: false, premiumProperty: false, featuredProperty: false, hotProperty: false },
            
            seo: data.seo || { metaTitle: '', metaDescription: '', metaKeywords: '' }
          });
          setSlugEdited(true);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setErrorMsg('Failed to fetch property details.');
          setLoading(false);
        });
    }
  }, [id]);
  
  useEffect(() => {
    if (!slugEdited && formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, slugEdited]);

  // Nested change handlers
  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleCheckboxChange = (section, field) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }));
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => {
      const current = prev.amenities;
      if (current.includes(amenity)) {
        return { ...prev, amenities: current.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...current, amenity] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.type || !formData.purpose || !formData.status || !formData.pricing.price || !formData.location.state || !formData.location.city || !formData.location.area || !formData.location.fullAddress || !formData.description.short || !formData.description.full || (!id && !formData.images.featured)) {
      setErrorMsg('Please fill out all required (*) fields.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const formDataToSend = new FormData();
      
      const { images, ...dataWithoutImages } = formData;
      formDataToSend.append('data', JSON.stringify({ ...dataWithoutImages, images: { videoUrl: images.videoUrl, featured: existingImages.featured, gallery: existingImages.gallery } }));
      
      if (images.featured) {
        formDataToSend.append('featuredImage', images.featured);
      }
      
      if (images.gallery && images.gallery.length > 0) {
        Array.from(images.gallery).forEach(file => {
          formDataToSend.append('galleryImages', file);
        });
      }

      const url = id ? `${import.meta.env.VITE_API_BASE_URL}/api/properties/${id}` : `${import.meta.env.VITE_API_BASE_URL}/api/properties`;
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method: method,
        body: formDataToSend
      });

      if (res.ok) {
        navigate('/properties');
      } else {
        const err = await res.json();
        setErrorMsg(err.message || 'Failed to save property');
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
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/properties')}
          className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{id ? 'Edit Property' : 'Add New Property'}</h1>
          <p className="text-slate-500 mt-1">{id ? 'Update the details below.' : 'Complete the details below to list a new property.'}</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 shadow-sm animate-in fade-in">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Basic Information */}
        <section className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Info className="text-blue-500 w-6 h-6" /> 1. Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Property Title *</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Property Slug (Auto Generated)</label>
              <input type="text" value={formData.slug} onChange={(e) => { setFormData({...formData, slug: e.target.value}); setSlugEdited(true); }} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Category *</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all">
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Plots/Land">Plots/Land</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Property Type *</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all">
                <option value="">Select Property Type</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Commercial">Commercial</option>
                <option value="Plots/Land">Plots/Land</option>
                <option value="Independent House">Independent House</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Property Purpose *</label>
              <select value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all">
                <option>Sale</option>
                <option>Rent</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Property Status *</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all">
                <option>Available</option>
                <option>Sold</option>
                <option>Rented</option>
                <option>Upcoming</option>
              </select>
            </div>
          </div>
        </section>

        {/* 2. Pricing Details */}
        <section className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <span className="text-blue-500 w-6 h-6 flex items-center justify-center font-bold text-xl">$</span> 2. Pricing Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Property Price *</label>
              <input type="text" value={formData.pricing.price} onChange={(e) => handleNestedChange('pricing', 'price', e.target.value)} placeholder="e.g. $500,000" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Offer Price</label>
              <input type="text" value={formData.pricing.offerPrice} onChange={(e) => handleNestedChange('pricing', 'offerPrice', e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Price Per Sq.ft</label>
              <input type="text" value={formData.pricing.pricePerSqFt} onChange={(e) => handleNestedChange('pricing', 'pricePerSqFt', e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Maintenance Charges</label>
              <input type="text" value={formData.pricing.maintenanceCharges} onChange={(e) => handleNestedChange('pricing', 'maintenanceCharges', e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
          </div>
        </section>

        {/* 3. Location Details */}
        <section className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <MapPin className="text-blue-500 w-6 h-6" /> 3. Location Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">State *</label>
              <input type="text" value={formData.location.state} onChange={(e) => handleNestedChange('location', 'state', e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">City *</label>
              <input type="text" value={formData.location.city} onChange={(e) => handleNestedChange('location', 'city', e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Area / Locality *</label>
              <input type="text" value={formData.location.area} onChange={(e) => handleNestedChange('location', 'area', e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Full Address *</label>
              <textarea value={formData.location.fullAddress} onChange={(e) => handleNestedChange('location', 'fullAddress', e.target.value)} rows="3" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Pincode</label>
              <input type="text" value={formData.location.pincode} onChange={(e) => handleNestedChange('location', 'pincode', e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Google Map Link</label>
              <input type="text" value={formData.location.googleMapLink} onChange={(e) => handleNestedChange('location', 'googleMapLink', e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
          </div>
        </section>

        {/* 4. Property Specifications */}
        <section className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Building className="text-blue-500 w-6 h-6" /> 4. Property Specifications
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Total Area (Sq.ft)</label>
              <input type="text" value={formData.specifications.totalArea} onChange={(e) => handleNestedChange('specifications', 'totalArea', e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Built-up Area</label>
              <input type="text" value={formData.specifications.builtUpArea} onChange={(e) => handleNestedChange('specifications', 'builtUpArea', e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Bedrooms (BHK)</label>
              <input type="number" value={formData.specifications.bedrooms} onChange={(e) => handleNestedChange('specifications', 'bedrooms', e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Bathrooms</label>
              <input type="number" value={formData.specifications.bathrooms} onChange={(e) => handleNestedChange('specifications', 'bathrooms', e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Balconies</label>
              <input type="number" value={formData.specifications.balconies} onChange={(e) => handleNestedChange('specifications', 'balconies', e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Floors</label>
              <input type="number" value={formData.specifications.floors} onChange={(e) => handleNestedChange('specifications', 'floors', e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Parking Spaces</label>
              <input type="number" value={formData.specifications.parkingSpaces} onChange={(e) => handleNestedChange('specifications', 'parkingSpaces', e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Facing</label>
              <select value={formData.specifications.facing} onChange={(e) => handleNestedChange('specifications', 'facing', e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all">
                <option value="">Select Facing</option>
                <option>East</option>
                <option>West</option>
                <option>North</option>
                <option>South</option>
              </select>
            </div>
          </div>
        </section>

        {/* 5. Amenities */}
        <section className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <CheckSquare className="text-blue-500 w-6 h-6" /> 5. Amenities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {AMENITIES_LIST.map((amenity) => (
              <label key={amenity} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <input 
                  type="checkbox" 
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" 
                />
                <span className="text-sm font-medium text-slate-700">{amenity}</span>
              </label>
            ))}
          </div>
        </section>

        {/* 6. Property Images */}
        <section className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <ImageIcon className="text-blue-500 w-6 h-6" /> 6. Property Images
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Featured Image (Upload) {id ? '(Optional - Leave empty to keep existing)' : '*'}</label>
              {existingImages.featured && (
                <div className="mb-4 relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                  <img src={existingImages.featured} alt="Featured" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => setExistingImages(prev => ({ ...prev, featured: null }))} className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors">
                      <span className="text-xs font-bold">Remove</span>
                    </button>
                  </div>
                </div>
              )}
              <input type="file" accept="image/*" onChange={(e) => handleNestedChange('images', 'featured', e.target.files[0])} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Gallery Images (Max 5 Images)</label>
              <input type="file" multiple accept="image/*" onChange={(e) => {
                if (e.target.files.length > 5) {
                  alert('You can only upload a maximum of 5 gallery images.');
                  e.target.value = '';
                  handleNestedChange('images', 'gallery', []);
                } else {
                  handleNestedChange('images', 'gallery', e.target.files);
                }
              }} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Property Video URL (Optional)</label>
              <input type="text" value={formData.images.videoUrl} onChange={(e) => handleNestedChange('images', 'videoUrl', e.target.value)} placeholder="YouTube or Vimeo URL" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
          </div>
        </section>

        {/* 7. Property Description */}
        <section className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <AlignLeft className="text-blue-500 w-6 h-6" /> 7. Property Description
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Short Description *</label>
              <textarea value={formData.description.short} onChange={(e) => handleNestedChange('description', 'short', e.target.value)} rows="2" placeholder="A brief 1-2 sentence overview..." className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full Description *</label>
              <textarea value={formData.description.full} onChange={(e) => handleNestedChange('description', 'full', e.target.value)} rows="6" placeholder="Complete detailed description of the property..." className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"></textarea>
            </div>
          </div>
        </section>

        {/* 8. Property Highlights */}
        <section className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Settings className="text-blue-500 w-6 h-6" /> 8. Property Highlights
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="checkbox" checked={formData.highlights.readyToMove} onChange={() => handleCheckboxChange('highlights', 'readyToMove')} className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-slate-700">Ready to Move</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="checkbox" checked={formData.highlights.newLaunch} onChange={() => handleCheckboxChange('highlights', 'newLaunch')} className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-slate-700">New Launch</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="checkbox" checked={formData.highlights.premiumProperty} onChange={() => handleCheckboxChange('highlights', 'premiumProperty')} className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-slate-700">Premium Property</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="checkbox" checked={formData.highlights.featuredProperty} onChange={() => handleCheckboxChange('highlights', 'featuredProperty')} className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-slate-700">Featured Property</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="checkbox" checked={formData.highlights.hotProperty} onChange={() => handleCheckboxChange('highlights', 'hotProperty')} className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-slate-700">Hot Property</span>
            </label>
          </div>
        </section>

        {/* 9. SEO (Optional) */}
        <section className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Search className="text-blue-500 w-6 h-6" /> 9. SEO (Optional)
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Meta Title</label>
              <input type="text" value={formData.seo.metaTitle} onChange={(e) => handleNestedChange('seo', 'metaTitle', e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Meta Description</label>
              <textarea value={formData.seo.metaDescription} onChange={(e) => handleNestedChange('seo', 'metaDescription', e.target.value)} rows="3" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Meta Keywords</label>
              <input type="text" value={formData.seo.metaKeywords} onChange={(e) => handleNestedChange('seo', 'metaKeywords', e.target.value)} placeholder="Comma separated keywords" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-4 sticky bottom-6 z-10 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl">
          <button 
            type="button"
            onClick={() => navigate('/properties')}
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
            {loading ? (id ? 'Updating Property...' : 'Saving Property...') : (id ? 'Update Property' : 'Save Property')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;
