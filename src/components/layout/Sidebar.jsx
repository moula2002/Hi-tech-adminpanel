import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, Settings, LogOut, MessageSquare, Tags, X } from 'lucide-react';
import logo from '../../assets/logo.png';

const Sidebar = ({ onClose }) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Building2, label: 'Properties', path: '/properties' },
    { icon: Tags, label: 'Categories', path: '/categories' },
    { icon: MessageSquare, label: 'Enquiries', path: '/enquiries', badge: '1' },
    { icon: Users, label: 'Agents', path: '/agents' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800/60 shadow-2xl z-20">
      <div className="p-6 flex items-center justify-between relative">
        <div className="flex items-center gap-4">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
          <img src={logo} alt="Hi-Tech Estates" className="h-16 sm:h-20 w-auto object-contain drop-shadow-lg rounded-lg" />
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
      
      <nav className="flex-1 py-4 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 font-medium group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-blue-400 shadow-[inset_0px_1px_0px_rgba(255,255,255,0.05),0_0_15px_rgba(59,130,246,0.1)]'
                  : 'hover:bg-slate-900 hover:text-slate-100 hover:shadow-sm hover:-translate-y-0.5'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
              {item.label}
            </div>
            {item.badge && (
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg shadow-blue-500/30">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
        <NavLink to="/login" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group hover:-translate-y-0.5">
          <LogOut className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
          <span className="font-medium">Sign Out</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
