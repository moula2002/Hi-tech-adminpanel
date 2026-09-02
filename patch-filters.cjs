const fs = require('fs');
const path = require('path');

const homePath = path.join(__dirname, '../hi-tech/src/pages/Home.jsx');
const propsPath = path.join(__dirname, '../hi-tech/src/pages/Properties.jsx');

if (fs.existsSync(homePath)) {
    let homeContent = fs.readFileSync(homePath, 'utf8');
    
    // Replace dynamicPropertyTypes definition
    homeContent = homeContent.replace(
        /const dynamicPropertyTypes = \[\.\.\.new Set\(apiProperties\.map\(p => p\.type\)\.filter\(Boolean\)\)\]\.sort\(\);/,
        `const dynamicPropertyTypes = [...new Set([...apiProperties.map(p => p.type).filter(Boolean), 'Commercial', 'Plots/Land', 'New Launch'])].sort();`
    );
    
    fs.writeFileSync(homePath, homeContent, 'utf8');
    console.log("Updated Home.jsx");
}

if (fs.existsSync(propsPath)) {
    let propsContent = fs.readFileSync(propsPath, 'utf8');
    
    // Replace allPropertyTypes definition
    propsContent = propsContent.replace(
        /const allPropertyTypes = \['All Type', \.\.\.new Set\(sourceProperties\.map\(p => p\.type\)\.filter\(Boolean\)\)\]\.sort\(\);/,
        `const allPropertyTypes = ['All Type', ...new Set([...sourceProperties.map(p => p.type).filter(Boolean), 'Commercial', 'Plots/Land', 'New Launch'])].sort();`
    );

    // Modify the filtering logic to handle New Launch and Commercial smartly
    propsContent = propsContent.replace(
        /if \(filter\.type !== 'All Type' && filter\.type !== '' && p\.type !== filter\.type\) return false;/,
        `if (filter.type !== 'All Type' && filter.type !== '') {
        if (filter.type === 'New Launch') {
          if (!p.highlights?.newLaunch && p.type !== 'New Launch') return false;
        } else {
          if (p.type !== filter.type) return false;
        }
      }`
    );

    fs.writeFileSync(propsPath, propsContent, 'utf8');
    console.log("Updated Properties.jsx");
}
