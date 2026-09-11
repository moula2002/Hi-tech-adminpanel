const fs = require('fs');
const path = require('path');

const targetPath = path.join('C:', 'Users', 'rvikk', 'Desktop', 'hi-tech server', 'server.js');

if (!fs.existsSync(targetPath)) {
  console.error('File not found:', targetPath);
  process.exit(1);
}

let content = fs.readFileSync(targetPath, 'utf8');
let originalContent = content;

// Replace upload.fields in POST /api/properties
content = content.replace(
  /app\.post\('\/api\/properties', upload\.fields\(\[\{ name: 'featuredImage', maxCount: 1 \}, \{ name: 'galleryImages', maxCount: 5 \}\]\), async/g,
  "app.post('/api/properties', upload.fields([{ name: 'featuredImage', maxCount: 1 }, { name: 'galleryImages', maxCount: 5 }, { name: 'propertyVideo', maxCount: 1 }]), async"
);

// Replace upload.fields in PUT /api/properties/:id
content = content.replace(
  /app\.put\('\/api\/properties\/:id', upload\.fields\(\[\{ name: 'featuredImage', maxCount: 1 \}, \{ name: 'galleryImages', maxCount: 5 \}\]\), async/g,
  "app.put('/api/properties/:id', upload.fields([{ name: 'featuredImage', maxCount: 1 }, { name: 'galleryImages', maxCount: 5 }, { name: 'propertyVideo', maxCount: 1 }]), async"
);

// Add video logic in POST
content = content.replace(
  /(\/\/ Assign gallery images\s+if \(req\.files && req\.files\['galleryImages'\]\) \{\s+const galleryUrls = req\.files\['galleryImages'\]\.map\(f => `data:\$\{f\.mimetype\};base64,\$\{f\.buffer\.toString\('base64'\)\}`\);\s+propertyData\.images\.gallery = galleryUrls;\s+\})/g,
  `$1\n\n    // Assign video\n    if (req.files && req.files['propertyVideo']) {\n      propertyData.images.videoUrl = \`data:\${req.files['propertyVideo'][0].mimetype};base64,\${req.files['propertyVideo'][0].buffer.toString('base64')}\`;\n    }`
);

// Add video logic in PUT (need to find where gallery logic ends)
content = content.replace(
  /(if \(req\.files && req\.files\['galleryImages'\]\) \{\s+const galleryUrls = req\.files\['galleryImages'\]\.map\(f => `data:\$\{f\.mimetype\};base64,\$\{f\.buffer\.toString\('base64'\)\}`\);\s+propertyData\.images\.gallery = propertyData\.images\.gallery && propertyData\.images\.gallery\.length > 0\s+\? \[\.\.\.propertyData\.images\.gallery, \.\.\.galleryUrls\]\s+: galleryUrls;\s+\})/g,
  `$1\n\n    if (req.files && req.files['propertyVideo']) {\n      propertyData.images.videoUrl = \`data:\${req.files['propertyVideo'][0].mimetype};base64,\${req.files['propertyVideo'][0].buffer.toString('base64')}\`;\n    }`
);

if (content !== originalContent) {
  fs.writeFileSync(targetPath, content, 'utf8');
  console.log('Successfully patched server.js for video upload');
} else {
  console.log('No changes made to server.js (might already be patched or regex failed)');
}
