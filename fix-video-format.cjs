const fs = require('fs');
const path = require('path');

const adminPath = path.join('C:', 'Users', 'rvikk', 'Desktop', 'hi-tech admin', 'src', 'pages', 'AddProperty.jsx');
if (fs.existsSync(adminPath)) {
  let content = fs.readFileSync(adminPath, 'utf8');

  // Restrict video formats to HTML5 supported formats
  content = content.replace(
    /accept="video\/\*"/g,
    'accept="video/mp4,video/webm,video/ogg"'
  );

  fs.writeFileSync(adminPath, content, 'utf8');
  console.log('Fixed AddProperty.jsx video accept types');
}
