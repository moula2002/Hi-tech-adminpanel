const fs = require('fs');

function updateProperties() {
  const file = '../hi-tech/src/pages/Properties.jsx';
  let content = fs.readFileSync(file, 'utf8');

  // filter state initialization
  content = content.replace(
    /const \[filter, setFilter\] = useState\(\{\n      location: queryParams.get\('location'\) \|\| '',\n      type: queryParams.get\('type'\) \|\| 'All Type',\n      category: queryParams.get\('category'\) \|\| '',\n      bhk: queryParams.get\('bhk'\) \|\| '',\n      budget: queryParams.get\('budget'\) \|\| '',\n      status: 'All', \/\/ Sale\/Rent\n      furnishing: '',\n    \}\);/g,
    `const [filter, setFilter] = useState({\n      location: queryParams.get('location') || '',\n      category: queryParams.get('category') || '',\n      type: queryParams.get('type') || 'All Type',\n      bhk: queryParams.get('bhk') || '',\n      budget: queryParams.get('budget') || '',\n      status: 'All',\n      furnishing: '',\n      newLaunch: queryParams.get('newLaunch') === 'true',\n    });`
  );

  // filtering logic
  const oldFilterLogic = `  const filteredProperties = apiProperties.filter(p => {
    if (filter.location && p.location !== filter.location) return false;
    if (filter.type !== 'All Type' && filter.type !== '') {
        if (filter.type === 'New Launch') {
          if (!p.highlights?.newLaunch && p.type !== 'New Launch') return false;
        } else {
          if (p.type !== filter.type) return false;
        }
      }
    
    if (filter.category) {
      const pType = (p.type || '').toLowerCase();
      const cName = filter.category.toLowerCase();
      if (pType !== cName && !cName.includes(pType) && !pType.includes(cName.replace(/s$/, '')) && cName.replace(/st$/, 't') !== pType) return false;
    }
    
    if (filter.bhk) {`;
  
  const newFilterLogic = `  const filteredProperties = apiProperties.filter(p => {
    if (filter.location && p.location !== filter.location) return false;
    if (filter.category && p.category && p.category !== filter.category) return false;
    if (filter.category && !p.category) {
      // Fallback for old properties without category
      const pType = (p.type || '').toLowerCase();
      const cName = filter.category.toLowerCase();
      if (pType !== cName && !cName.includes(pType) && !pType.includes(cName.replace(/s$/, '')) && cName.replace(/st$/, 't') !== pType) return false;
    }
    if (filter.type !== 'All Type' && filter.type !== '' && p.type !== filter.type) return false;
    if (filter.newLaunch && !p.highlights?.newLaunch) return false;
    
    if (filter.bhk) {`;

  content = content.replace(oldFilterLogic, newFilterLogic);

  // Add UI for Category and NewLaunch right above the 'Property Type' field in the sidebar
  // We look for:
  //            <div className="mb-6">
  //              <h4 className="text-sm font-bold text-charcoal-700 uppercase mb-3 tracking-wider">Property Type</h4>
  
  const oldTypeUI = `            <div className="mb-6">
              <h4 className="text-sm font-bold text-charcoal-700 uppercase mb-3 tracking-wider">Property Type</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">`;

  const newTypeUI = `            <div className="mb-6">
              <h4 className="text-sm font-bold text-charcoal-700 uppercase mb-3 tracking-wider">Category</h4>
              <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm font-medium"
                value={filter.category} onChange={(e) => setFilter({...filter, category: e.target.value})}>
                <option value="">Any Category</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Plots/Land">Plots/Land</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-lg border border-gray-200">
                <input type="checkbox" checked={filter.newLaunch} onChange={(e) => setFilter({...filter, newLaunch: e.target.checked})} className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500" />
                <span className="text-sm font-bold text-charcoal-700 uppercase">New Launch Only</span>
              </label>
            </div>
            <div className="mb-6">
              <h4 className="text-sm font-bold text-charcoal-700 uppercase mb-3 tracking-wider">Property Type</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">`;

  content = content.replace(oldTypeUI, newTypeUI);
  
  // also update reset button
  content = content.replace(/location: '', type: 'All Type', category: '', bhk: '', budget: '', status: 'All', furnishing: ''/g, "location: '', type: 'All Type', category: '', bhk: '', budget: '', status: 'All', furnishing: '', newLaunch: false");

  fs.writeFileSync(file, content);
}

updateProperties();
