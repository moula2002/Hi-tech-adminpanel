const fs = require('fs');
const path = require('path');

// Fix Admin Panel
const adminPath = path.join('C:', 'Users', 'rvikk', 'Desktop', 'hi-tech admin', 'src', 'pages', 'AddProperty.jsx');
if (fs.existsSync(adminPath)) {
  let content = fs.readFileSync(adminPath, 'utf8');
  
  // 1. Fix sticky footer overlap by increasing bottom padding
  content = content.replace(
    /className="space-y-6 max-w-5xl mx-auto pb-10"/g,
    'className="space-y-6 max-w-5xl mx-auto pb-32"'
  );

  // 2. Reduce video size limit to 5MB to avoid MongoDB 16MB Base64 crash
  content = content.replace(
    /if \(file && file\.size > 15 \* 1024 \* 1024\)/g,
    'if (file && file.size > 5 * 1024 * 1024)'
  );
  content = content.replace(
    /alert\("Video size must be less than 15MB"\);/g,
    'alert("Video size must be less than 5MB to fit in database.");'
  );
  content = content.replace(
    /Property Video Upload \(Optional, Max 15MB\)/g,
    'Property Video Upload (Optional, Max 5MB)'
  );

  fs.writeFileSync(adminPath, content, 'utf8');
  console.log('Fixed AddProperty.jsx');
}

// Fix Frontend PropertyDetail.jsx
const frontendPath = path.join('C:', 'Users', 'rvikk', 'Desktop', 'hi-tech', 'src', 'pages', 'PropertyDetail.jsx');
if (fs.existsSync(frontendPath)) {
  let content = fs.readFileSync(frontendPath, 'utf8');

  // Fix the render logic to support YouTube iframes
  content = content.replace(
    /const isVideo = \(url\) => url && typeof url === 'string' && \(url\.startsWith\('data:video\/'\) \|\| url\.match\(\/\\\\.\(mp4\|webm\|ogg\)\\$\/i\) \|\| url\.includes\('youtube\.com'\) \|\| url\.includes\('vimeo\.com'\)\);/g,
    `const isVideo = (url) => url && typeof url === 'string' && (url.startsWith('data:video/') || url.match(/\\.(mp4|webm|ogg)$/i));
    const isEmbed = (url) => url && typeof url === 'string' && (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com'));
    
    const getEmbedUrl = (url) => {
      if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
      if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
      if (url.includes('vimeo.com/')) return url.replace('vimeo.com/', 'player.vimeo.com/video/');
      return url;
    };`
  );

  // Replace main viewer
  const mainViewerReplacement = `{isEmbed(allImages[currentImgIndex]) ? (
                    <iframe
                      key={currentImgIndex}
                      src={getEmbedUrl(allImages[currentImgIndex])}
                      className="w-full h-full object-cover animate-slider bg-black"
                      allowFullScreen
                    ></iframe>
                  ) : isVideo(allImages[currentImgIndex]) ? (
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
                  )}`;
  
  // Find the existing block and replace
  const oldMainViewerRegex = /\{isVideo\(allImages\[currentImgIndex\]\)\s*\?\s*\([\s\S]*?className="w-full h-full object-cover animate-slider"\s*\/>\s*\)\}/;
  content = content.replace(oldMainViewerRegex, mainViewerReplacement);

  // Replace thumbnail viewer
  const thumbViewerReplacement = `{isEmbed(img) ? (
                          <div className="relative w-full h-full">
                            <iframe src={getEmbedUrl(img)} className="w-full h-full object-cover bg-black pointer-events-none" />
                            <div className="absolute inset-0 z-10" />
                          </div>
                        ) : isVideo(img) ? (
                          <div className="relative w-full h-full">
                            <video src={img} className="w-full h-full object-cover bg-black" muted />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30"><div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center"><div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-black border-b-4 border-b-transparent ml-1"></div></div></div>
                          </div>
                        ) : (
                          <img src={img} alt={\`Thumb \${idx}\`} className="w-full h-full object-cover" />
                        )}`;

  const oldThumbViewerRegex = /\{isVideo\(img\)\s*\?\s*\([\s\S]*?className="w-full h-full object-cover"\s*\/>\s*\)\}/;
  content = content.replace(oldThumbViewerRegex, thumbViewerReplacement);

  fs.writeFileSync(frontendPath, content, 'utf8');
  console.log('Fixed PropertyDetail.jsx');
}
