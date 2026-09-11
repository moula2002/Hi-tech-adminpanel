const fs = require('fs');
const path = require('path');

const targetPath = path.join('C:', 'Users', 'rvikk', 'Desktop', 'hi-tech', 'src', 'components', 'property', 'PropertyCard.jsx');

if (!fs.existsSync(targetPath)) {
  console.error('File not found:', targetPath);
  process.exit(1);
}

let content = fs.readFileSync(targetPath, 'utf8');
let originalContent = content;

const searchString = `{/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {property.featured && (
            <span className="bg-[#68d320] text-white px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wide shadow-sm">
              Featured
            </span>
          )}
          {property.status && property.status.toLowerCase().includes('rent') && !property.featured && (
             <span className="bg-[#68d320] text-white px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wide shadow-sm">
               {property.status}
             </span>
          )}
          {property.badges && property.badges.map((badge, index) => (
             <span key={index} className="bg-black/70 text-white px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm shadow-sm">
               {badge}
             </span>
          ))}
        </div>
        
        <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 justify-end">
          {property.status && !property.status.toLowerCase().includes('rent') && (
            <span className="bg-black/70 text-white px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm">
              {property.status}
            </span>
          )}
          {property.type && (
            <span className="bg-black/70 text-white px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm">
              {property.type}
            </span>
          )}
        </div>`;

const replaceString = `{/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5 items-start">
          {property.featured && (
            <span className="bg-[#68d320] text-white px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wide shadow-sm">
              Featured
            </span>
          )}
          {property.status && property.status.toLowerCase().includes('rent') && !property.featured && (
             <span className="bg-[#68d320] text-white px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wide shadow-sm">
               {property.status}
             </span>
          )}
          {property.badges && property.badges.map((badge, index) => (
             <span key={index} className="bg-black/70 text-white px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm shadow-sm">
               {badge}
             </span>
          ))}
          {property.status && !property.status.toLowerCase().includes('rent') && (
            <span className="bg-black/70 text-white px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm">
              {property.status}
            </span>
          )}
          {property.type && (
            <span className="bg-black/70 text-white px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm">
              {property.type}
            </span>
          )}
        </div>`;

content = content.replace(searchString, replaceString);

// Sometimes newline characters might cause matching issues, let's use a regex approach if the string replacement fails
if (content === originalContent) {
  console.log("String replacement failed, trying regex approach...");
  const regex = /\{\/\*\s*Top Badges\s*\*\/\}\s*<div className="absolute top-3 left-3 flex flex-wrap gap-1\.5">[\s\S]*?<\/div>\s*<div className="absolute top-3 right-3 flex flex-wrap gap-1\.5 justify-end">[\s\S]*?<\/div>/;
  content = content.replace(regex, replaceString);
}

if (content !== originalContent) {
  fs.writeFileSync(targetPath, content, 'utf8');
  console.log('Successfully patched PropertyCard.jsx');
} else {
  console.log('No changes made to PropertyCard.jsx (might already be patched or regex failed)');
}
