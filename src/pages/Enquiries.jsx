import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, MoreVertical, Archive, Check } from 'lucide-react';

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = (enquiry.name && enquiry.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (enquiry.email && enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/enquiries');
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setEnquiries(data);
      } else {
        setEnquiries([]);
      }
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' })
      });
      if (res.ok) fetchEnquiries();
    } catch (err) {
      console.error(err);
    }
  };

  const archiveMessage = async (id) => {
    if (!window.confirm('Are you sure you want to archive/delete this enquiry?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/enquiries/${id}`, { method: 'DELETE' });
      if (res.ok) fetchEnquiries();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Enquiries</h1>
          <p className="text-slate-500">Manage messages from prospective clients</p>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden">
        <div className="p-6 border-b border-white/50 bg-white/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-2.5 bg-white/80 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 w-full sm:w-72 shadow-sm transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-white/80 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 shadow-sm transition-all"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
            <div className="text-sm text-slate-600 bg-white/60 px-4 py-2.5 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-white">
              <span className="font-bold text-blue-600">{enquiries.filter(e => e.status === 'unread').length} Unread</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-white/50">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading enquiries...</div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No enquiries found.
            </div>
          ) : filteredEnquiries.map((enquiry) => (
            <div key={enquiry.id} className={`p-6 flex flex-col md:flex-row gap-6 transition-all duration-300 hover:bg-white/60 ${enquiry.status === 'unread' ? 'bg-blue-50/40 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className={`text-base ${enquiry.status === 'unread' ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                    {enquiry.name}
                  </h3>
                  {enquiry.status === 'unread' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold shadow-sm shadow-blue-500/30">New</span>
                  )}
                  <span className="text-xs font-medium text-slate-400 ml-auto md:hidden">{enquiry.date}</span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5 hover:text-blue-600 cursor-pointer transition-colors">
                    <Mail className="w-4 h-4" />
                    {enquiry.email}
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-blue-600 cursor-pointer transition-colors">
                    <Phone className="w-4 h-4" />
                    {enquiry.phone || 'N/A'}
                  </div>
                  {enquiry.propertyId && enquiry.propertyId.title && (
                    <div className="flex items-center gap-1.5 text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded">
                      Property: {enquiry.propertyId.title}
                    </div>
                  )}
                  {enquiry.interestedIn && (
                    <div className="flex items-center gap-1.5 text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                      Interested In: {enquiry.interestedIn}
                    </div>
                  )}
                  {enquiry.formSource && (
                    <div className="flex items-center gap-1.5 text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded">
                      Source: {enquiry.formSource}
                    </div>
                  )}
                </div>

                <p className="text-sm text-slate-700 bg-white/80 border border-white p-5 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                  "{enquiry.message}"
                </p>
              </div>

              <div className="flex md:flex-col items-center justify-between md:justify-start gap-3 md:pl-6 md:border-l md:border-slate-100">
                <span className="text-xs text-slate-400 hidden md:block whitespace-nowrap">{enquiry.date}</span>
                <div className="flex items-center gap-2">
                  {enquiry.status === 'unread' && (
                    <button
                      onClick={() => markAsRead(enquiry.id)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors tooltip tooltip-left"
                      title="Mark as read"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => archiveMessage(enquiry.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Archive"
                  >
                    <Archive className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Enquiries;
