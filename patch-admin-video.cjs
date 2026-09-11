const fs = require('fs');
const path = require('path');

const patchAdminPropertyFiles = (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Update initial state (or fetched state) to include videoFile
  // In AddProperty, it's `images: { featured: null, gallery: [], videoUrl: '' }`
  content = content.replace(
    /images: \{ featured: null, gallery: \[\], videoUrl: '' \}/g,
    'images: { featured: null, gallery: [], videoUrl: \'\', videoFile: null }'
  );

  // In AddProperty (fetch), it's `videoUrl: data.images?.videoUrl || ''`
  content = content.replace(
    /images: \{ featured: null, gallery: \[\], videoUrl: data\.images\?\.videoUrl \|\| '' \}/g,
    'images: { featured: null, gallery: [], videoUrl: data.images?.videoUrl || \'\', videoFile: null }'
  );

  // 2. Update formDataToSend mapping
  // Current: formDataToSend.append('data', JSON.stringify({ ...dataWithoutImages, images: { videoUrl: images.videoUrl, featured: existingImages.featured, gallery: existingImages.gallery } }));
  // Or without existingImages: formDataToSend.append('data', JSON.stringify({ ...dataWithoutImages, images: { videoUrl: images.videoUrl, featured: null, gallery: [] } }));
  // Instead of replacing blindly, we can use a regex to inject videoFile append logic right before the featuredImage append
  
  content = content.replace(
    /if\s*\(\s*images\.featured\s*\)\s*\{/g,
    'if (images.videoFile) {\n        formDataToSend.append(\'propertyVideo\', images.videoFile);\n      }\n      \n      if (images.featured) {'
  );

  // 3. Update the Video URL input to a File input
  const textInputRegex = /<input type="text" value=\{formData\.images\.videoUrl\} onChange=\{\(e\) => handleNestedChange\('images', 'videoUrl', e\.target\.value\)\} placeholder="YouTube or Vimeo URL" className="([^"]+)" \/>/g;
  
  content = content.replace(
    textInputRegex,
    `<input type="file" accept="video/*" onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.size > 15 * 1024 * 1024) {
                    alert("Video size must be less than 15MB");
                    e.target.value = '';
                    return;
                  }
                  handleNestedChange('images', 'videoFile', file);
                }} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />`
  );

  // Update label
  content = content.replace(
    /<label className="text-sm font-semibold text-slate-700">Property Video URL \(Optional\)<\/label>/g,
    '<label className="text-sm font-semibold text-slate-700">Property Video Upload (Optional, Max 15MB)</label>'
  );

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully patched admin file for video upload:', filePath);
  } else {
    console.log('No changes made to:', filePath);
  }
};

const addPropPath = path.join('C:', 'Users', 'rvikk', 'Desktop', 'hi-tech admin', 'src', 'pages', 'AddProperty.jsx');
const editPropPath = path.join('C:', 'Users', 'rvikk', 'Desktop', 'hi-tech admin', 'src', 'pages', 'EditProperty.jsx');

// Only run if the files exist (they should be in this repo or somewhere)
if (fs.existsSync(addPropPath)) patchAdminPropertyFiles(addPropPath);
if (fs.existsSync(editPropPath)) patchAdminPropertyFiles(editPropPath);
