const fs = require('fs');
const path = require('path');

const frontendPath = path.join('C:', 'Users', 'rvikk', 'Desktop', 'hi-tech', 'src', 'pages', 'PropertyDetail.jsx');
if (fs.existsSync(frontendPath)) {
  let content = fs.readFileSync(frontendPath, 'utf8');

  // We find the exact line and replace it
  const oldIsVideo = "const isVideo = (url) => url && typeof url === 'string' && (url.startsWith('data:video/') || url.match(/\\.(mp4|webm|ogg)$/i) || url.includes('youtube.com') || url.includes('vimeo.com'));";
  
  const newDefinitions = `const isVideo = (url) => url && typeof url === 'string' && (url.startsWith('data:video/') || url.match(/\\.(mp4|webm|ogg)$/i));
  const isEmbed = (url) => url && typeof url === 'string' && (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com'));
  
  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
    if (url.includes('vimeo.com/')) return url.replace('vimeo.com/', 'player.vimeo.com/video/');
    return url;
  };`;

  if (content.includes(oldIsVideo)) {
    content = content.replace(oldIsVideo, newDefinitions);
    fs.writeFileSync(frontendPath, content, 'utf8');
    console.log('Fixed PropertyDetail.jsx');
  } else {
    console.log('oldIsVideo string not found perfectly. Trying regex fallback.');
    const regex = /const isVideo = \(url\) => url && typeof url === 'string' && \(url\.startsWith\('data:video\/'\) \|\| url\.match\(\/\\\\\.\(mp4\|webm\|ogg\)\\\$\/i\) \|\| url\.includes\('youtube\.com'\) \|\| url\.includes\('vimeo\.com'\)\);/;
    
    // Actually the easiest fallback is to just replace whatever line has `const isVideo = ` until `const nextImage = `
    const blockRegex = /const isVideo = \([\s\S]*?const nextImage =/;
    content = content.replace(blockRegex, newDefinitions + '\\n  const nextImage =');
    fs.writeFileSync(frontendPath, content, 'utf8');
    console.log('Fixed PropertyDetail.jsx with fallback');
  }
}
