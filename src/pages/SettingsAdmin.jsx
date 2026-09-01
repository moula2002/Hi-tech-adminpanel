import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Save, Loader2, ShieldCheck } from 'lucide-react';

const SettingsAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          password: ''
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const updateData = { ...profile };
      if (!updateData.password) delete updateData.password; // Only update if typed

      const res = await fetch('http://localhost:5000/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      if (res.ok) {
        setMessage('Profile updated successfully!');
        setProfile(prev => ({ ...prev, password: '' }));
      } else {
        setMessage('Failed to update profile.');
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occurred.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-slate-500 mt-1">Manage your admin profile and security preferences.</p>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden max-w-3xl relative">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div className="p-8 sm:p-10 relative">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-2xl">
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{profile.name || 'Admin User'}</h2>
              <p className="text-slate-500 flex items-center gap-1.5 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Super Administrator
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" /> Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/80 border border-slate-200/60 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 shadow-sm transition-all text-slate-700"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-500" /> Phone Number
                </label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-white/80 border border-slate-200/60 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 shadow-sm transition-all text-slate-700"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" /> Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                required
                className="w-full px-4 py-3 bg-white/80 border border-slate-200/60 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 shadow-sm transition-all text-slate-700"
              />
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-slate-400" /> Security
              </h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">New Password (leave blank to keep current)</label>
                <input
                  type="password"
                  value={profile.password}
                  onChange={(e) => setProfile({...profile, password: e.target.value})}
                  className="w-full px-4 py-3 bg-white/80 border border-slate-200/60 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 shadow-sm transition-all text-slate-700"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-xl text-sm font-medium ${message.includes('successfully') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' : 'bg-red-50 text-red-700 border border-red-200/50'}`}>
                {message}
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-[0_8px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_25px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 font-bold disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsAdmin;
