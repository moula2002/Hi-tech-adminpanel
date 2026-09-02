const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'pages');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace all occurrences of 'http://localhost:5000...', "http://localhost:5000..." and `http://localhost:5000...`
    content = content.replace(/['"`]http:\/\/localhost:5000([^'"`]*)['"`]/g, "`\\${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}$1`");

    fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            replaceInFile(fullPath);
        }
    }
}

walkDir(srcDir);
console.log("Replaced localhost:5000 in all files in src/pages");
