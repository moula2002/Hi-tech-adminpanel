const fs = require('fs');
const path = require('path');

const adminPath = path.join('C:', 'Users', 'rvikk', 'Desktop', 'hi-tech admin', 'src', 'pages', 'AddProperty.jsx');
if (fs.existsSync(adminPath)) {
  let content = fs.readFileSync(adminPath, 'utf8');

  // Featured Image Limit
  content = content.replace(
    /onChange=\{\(e\) => handleNestedChange\('images', 'featured', e\.target\.files\[0\]\)\}/g,
    `onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.size > 2 * 1024 * 1024) {
                    alert("Featured image size must be less than 2MB.");
                    e.target.value = '';
                    return;
                  }
                  handleNestedChange('images', 'featured', file);
                }}`
  );

  // Gallery Images Limit
  content = content.replace(
    /if \(e\.target\.files\.length > 5\) \{/g,
    `const filesArray = Array.from(e.target.files);
                const hasLargeFile = filesArray.some(f => f.size > 1 * 1024 * 1024);
                if (hasLargeFile) {
                  alert('Each gallery image must be less than 1MB.');
                  e.target.value = '';
                  return;
                }
                if (e.target.files.length > 5) {`
  );

  fs.writeFileSync(adminPath, content, 'utf8');
  console.log('Fixed AddProperty.jsx image size limits');
}
