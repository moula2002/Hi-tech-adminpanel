const fs = require('fs');

function updateHome() {
  const file = '../hi-tech/src/pages/Home.jsx';
  let content = fs.readFileSync(file, 'utf8');

  // searchParams state
  content = content.replace(
    /const \[searchParams, setSearchParams\] = useState\(\{\n    location: '',\n    type: '',\n    bhk: '',\n    budget: ''\n  \}\);/g,
    `const [searchParams, setSearchParams] = useState({\n    location: '',\n    category: '',\n    type: '',\n    bhk: '',\n    budget: '',\n    newLaunch: false\n  });`
  );

  // handleSearch
  content = content.replace(
    /const handleSearch = \(\) => \{\n    \/\/ Navigate to properties page with search params as query string\n    const query = new URLSearchParams\(\);\n    if \(searchParams\.location\) query\.set\('location', searchParams\.location\);\n    if \(searchParams\.type\) query\.set\('type', searchParams\.type\);\n    if \(searchParams\.bhk\) query\.set\('bhk', searchParams\.bhk\);\n    if \(searchParams\.budget\) query\.set\('budget', searchParams\.budget\);\n\n    navigate\(\`\/properties\?\$[^{]*\{query\.toString\(\)\}\`\);\n  \};/g,
    `const handleSearch = () => {\n    const query = new URLSearchParams();\n    if (searchParams.location) query.set('location', searchParams.location);\n    if (searchParams.category) query.set('category', searchParams.category);\n    if (searchParams.type) query.set('type', searchParams.type);\n    if (searchParams.bhk) query.set('bhk', searchParams.bhk);\n    if (searchParams.budget) query.set('budget', searchParams.budget);\n    if (searchParams.newLaunch) query.set('newLaunch', 'true');\n\n    navigate(\`/properties?\${query.toString()}\`);\n  };`
  );

  // HTML Layout
  const searchBarTarget = `      {/* 2. Floating Search Bar */}
      <section className="relative z-20 max-w-6xl mx-auto px-4 -mt-12 mb-16" data-aos="fade-up" data-aos-delay="200">
        <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col md:flex-row gap-4 items-end border border-gray-100">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-charcoal-600 uppercase mb-2">Location</label>
            <select
              className="w-full p-3 border border-gray-200 rounded text-charcoal-700 focus:outline-none focus:border-primary-500 font-medium"
              value={searchParams.location}
              onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
            >
              <option value="">Location</option>
              {dynamicLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-charcoal-600 uppercase mb-2">Property Type</label>
            <select
              className="w-full p-3 border border-gray-200 rounded text-charcoal-700 focus:outline-none focus:border-primary-500 font-medium"
              value={searchParams.type}
              onChange={(e) => setSearchParams({ ...searchParams, type: e.target.value })}
            >
              <option value="">Type</option>
              {dynamicPropertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-charcoal-600 uppercase mb-2">BHK</label>
            <select
              className="w-full p-3 border border-gray-200 rounded text-charcoal-700 focus:outline-none focus:border-primary-500 font-medium"
              value={searchParams.bhk}
              onChange={(e) => setSearchParams({ ...searchParams, bhk: e.target.value })}
            >
              <option value="">BHK</option>
              {bhkOptions.map(bhk => <option key={bhk} value={bhk}>{bhk}</option>)}
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-charcoal-600 uppercase mb-2">Budget</label>
            <select
              className="w-full p-3 border border-gray-200 rounded text-charcoal-700 focus:outline-none focus:border-primary-500 font-medium"
              value={searchParams.budget}
              onChange={(e) => setSearchParams({ ...searchParams, budget: e.target.value })}
            >
              <option value="">Budget</option>
              {budgetRanges.map(budget => <option key={budget} value={budget}>{budget}</option>)}
            </select>
          </div>
          <div className="w-full md:w-auto">
            <button
              onClick={handleSearch}
              className="w-full md:w-48 p-3 bg-primary-900 text-white font-bold rounded hover:bg-primary-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <Search size={18} />
              Search Property
            </button>
          </div>
        </div>
      </section>`;

  const searchBarNew = `      {/* 2. Floating Search Bar */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 -mt-12 mb-16" data-aos="fade-up" data-aos-delay="200">
        <div className="bg-white rounded-lg shadow-xl p-6 flex flex-wrap lg:flex-nowrap gap-4 items-end border border-gray-100">
          <div className="flex-1 w-full min-w-[140px]">
            <label className="block text-xs font-bold text-charcoal-600 uppercase mb-2">Location</label>
            <select
              className="w-full p-3 border border-gray-200 rounded text-charcoal-700 focus:outline-none focus:border-primary-500 font-medium"
              value={searchParams.location}
              onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
            >
              <option value="">Location</option>
              {dynamicLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
          <div className="flex-1 w-full min-w-[140px]">
            <label className="block text-xs font-bold text-charcoal-600 uppercase mb-2">Category</label>
            <select
              className="w-full p-3 border border-gray-200 rounded text-charcoal-700 focus:outline-none focus:border-primary-500 font-medium"
              value={searchParams.category}
              onChange={(e) => setSearchParams({ ...searchParams, category: e.target.value })}
            >
              <option value="">Any</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Plots/Land">Plots/Land</option>
            </select>
          </div>
          <div className="flex-1 w-full min-w-[140px]">
            <label className="block text-xs font-bold text-charcoal-600 uppercase mb-2">Type</label>
            <select
              className="w-full p-3 border border-gray-200 rounded text-charcoal-700 focus:outline-none focus:border-primary-500 font-medium"
              value={searchParams.type}
              onChange={(e) => setSearchParams({ ...searchParams, type: e.target.value })}
            >
              <option value="">Type</option>
              {dynamicPropertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div className="flex-1 w-full min-w-[120px]">
            <label className="block text-xs font-bold text-charcoal-600 uppercase mb-2">BHK</label>
            <select
              className="w-full p-3 border border-gray-200 rounded text-charcoal-700 focus:outline-none focus:border-primary-500 font-medium"
              value={searchParams.bhk}
              onChange={(e) => setSearchParams({ ...searchParams, bhk: e.target.value })}
            >
              <option value="">BHK</option>
              {bhkOptions.map(bhk => <option key={bhk} value={bhk}>{bhk}</option>)}
            </select>
          </div>
          <div className="flex-1 w-full min-w-[140px]">
            <label className="block text-xs font-bold text-charcoal-600 uppercase mb-2">Budget</label>
            <select
              className="w-full p-3 border border-gray-200 rounded text-charcoal-700 focus:outline-none focus:border-primary-500 font-medium"
              value={searchParams.budget}
              onChange={(e) => setSearchParams({ ...searchParams, budget: e.target.value })}
            >
              <option value="">Budget</option>
              {budgetRanges.map(budget => <option key={budget} value={budget}>{budget}</option>)}
            </select>
          </div>
          <div className="flex items-center h-[50px] min-w-[120px] mb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={searchParams.newLaunch} onChange={(e) => setSearchParams({ ...searchParams, newLaunch: e.target.checked })} className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" />
              <span className="text-sm font-bold text-charcoal-700 uppercase">New Launch</span>
            </label>
          </div>
          <div className="w-full lg:w-auto">
            <button
              onClick={handleSearch}
              className="w-full lg:w-32 p-3 bg-primary-900 text-white font-bold rounded hover:bg-primary-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <Search size={18} />
              Search
            </button>
          </div>
        </div>
      </section>`;

  content = content.replace(searchBarTarget, searchBarNew);
  fs.writeFileSync(file, content);
}

updateHome();
