import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import PropertiesAdmin from './pages/PropertiesAdmin';
import AddProperty from './pages/AddProperty';
import Enquiries from './pages/Enquiries';
import AdminLogin from './pages/AdminLogin';
import CategoriesAdmin from './pages/CategoriesAdmin';
import AddCategory from './pages/AddCategory';
import SettingsAdmin from './pages/SettingsAdmin';
import BannersAdmin from './pages/BannersAdmin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="properties" element={<PropertiesAdmin />} />
          <Route path="properties/add" element={<AddProperty />} />
          <Route path="properties/edit/:id" element={<AddProperty />} />
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="categories/edit/:id" element={<AddCategory />} />
          <Route path="banners" element={<BannersAdmin />} />
          <Route path="enquiries" element={<Enquiries />} />
          <Route path="settings" element={<SettingsAdmin />} />
          {/* Add more routes here as needed (agents, settings) */}
          <Route path="*" element={
            <div className="flex items-center justify-center h-full text-slate-500">
              <p>Page coming soon...</p>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
