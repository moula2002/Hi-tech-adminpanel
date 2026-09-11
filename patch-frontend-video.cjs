const fs = require('fs');
const path = require('path');

const targetPath = path.join('C:', 'Users', 'rvikk', 'Desktop', 'hi-tech', 'src', 'pages', 'PropertyDetail.jsx');

if (!fs.existsSync(targetPath)) {
  console.error('File not found:', targetPath);
  process.exit(1);
}

let content = fs.readFileSync(targetPath, 'utf8');
let originalContent = content;

// 1. Add video to allImages
content = content.replace(
  /const allImages = property\.image \? \[property\.image\] : \[\];/g,
  'const allImages = property.image ? [property.image] : [];\n    if (property.videoUrl) allImages.push(property.videoUrl);'
);

// 2. Add isVideo helper
content = content.replace(
  /const nextImage = \(\) => setCurrentImgIndex\(\(prev\) => \(prev \+ 1\) % allImages\.length\);/g,
  `const isVideo = (url) => url && typeof url === 'string' && (url.startsWith('data:video/') || url.match(/\\.(mp4|webm|ogg)$/i) || url.includes('youtube.com') || url.includes('vimeo.com'));\n    const nextImage = () => setCurrentImgIndex((prev) => (prev + 1) % allImages.length);`
);

// 3. Replace img tag in main viewer
content = content.replace(
  /<img\s*key=\{currentImgIndex\}\s*src=\{allImages\[currentImgIndex\]\}\s*alt=\{property\.title\}\s*className="w-full h-full object-cover animate-slider"\s*\/>/g,
  `{isVideo(allImages[currentImgIndex]) ? (
                    <video
                      key={currentImgIndex}
                      src={allImages[currentImgIndex]}
                      controls
                      autoPlay
                      muted
                      loop
                      className="w-full h-full object-cover animate-slider bg-black"
                    />
                  ) : (
                    <img
                      key={currentImgIndex}
                      src={allImages[currentImgIndex]}
                      alt={property.title}
                      className="w-full h-full object-cover animate-slider"
                    />
                  )}`
);

// 4. Replace img tag in thumbnails
content = content.replace(
  /<img src=\{img\} alt=\{\`Thumb \$\{idx\}\`\} className="w-full h-full object-cover" \/>/g,
  `{isVideo(img) ? (
                          <div className="relative w-full h-full">
                            <video src={img} className="w-full h-full object-cover bg-black" muted />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30"><div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center"><div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-black border-b-4 border-b-transparent ml-1"></div></div></div>
                          </div>
                        ) : (
                          <img src={img} alt={\`Thumb \${idx}\`} className="w-full h-full object-cover" />
                        )}`
);

if (content !== originalContent) {
  fs.writeFileSync(targetPath, content, 'utf8');
  console.log('Successfully patched PropertyDetail.jsx');
} else {
  console.log('No changes made to PropertyDetail.jsx (might already be patched or regex failed)');
}
