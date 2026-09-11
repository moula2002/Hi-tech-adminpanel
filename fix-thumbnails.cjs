const fs = require('fs');
const path = require('path');

const frontendPath = path.join('C:', 'Users', 'rvikk', 'Desktop', 'hi-tech', 'src', 'pages', 'PropertyDetail.jsx');
if (fs.existsSync(frontendPath)) {
  let content = fs.readFileSync(frontendPath, 'utf8');

  const oldEmbedThumb = `<iframe src={getEmbedUrl(img)} className="w-full h-full object-cover bg-black pointer-events-none" />
                            <div className="absolute inset-0 z-10" />`;
                            
  const newEmbedThumb = `<iframe src={getEmbedUrl(img)} className="w-full h-full object-cover bg-black pointer-events-none" />
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
                              <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-red-600 border-b-4 border-b-transparent ml-1"></div>
                              </div>
                            </div>`;

  content = content.replace(oldEmbedThumb, newEmbedThumb);
  fs.writeFileSync(frontendPath, content, 'utf8');
  console.log('Fixed PropertyDetail.jsx thumbnails');
}
