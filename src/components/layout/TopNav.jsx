import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';

const TopNav = ({ onMenuClick }) => {
  return (
    <header className="h-16 sm:h-20 bg-white/60 backdrop-blur-md border-b border-white/40 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-blue-600 rounded-xl hover:bg-white/80 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden sm:flex items-center bg-white/80 rounded-2xl px-4 py-2.5 w-72 md:w-96 shadow-[inset_0px_2px_4px_rgba(0,0,0,0.02)] border border-slate-100 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Search properties, agents, or settings..."
            className="bg-transparent border-none outline-none w-full text-sm text-slate-700 placeholder:text-slate-400 font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <button className="relative p-2.5 bg-white/80 border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 hidden sm:block">
          <Search className="w-5 h-5" />
        </button>
        <button className="relative p-2.5 bg-white/80 border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm shadow-red-500/50"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-slate-200/60 cursor-pointer group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden border border-white shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-0.5">
            <User className="w-5 h-5 text-blue-600 transition-colors" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">Admin User</p>
            <p className="text-xs font-medium text-slate-400">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
