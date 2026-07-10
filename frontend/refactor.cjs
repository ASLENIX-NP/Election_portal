const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const appDir = path.join(srcDir, 'app');
const pagesDir = path.join(srcDir, 'pages');
const layoutsDir = path.join(srcDir, 'layouts');
const routesDir = path.join(srcDir, 'routes');

// Helper to safely move with cpSync/rmSync to avoid EPERM on open files
function safeMove(src, dest) {
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    try {
      fs.rmSync(src, { recursive: true, force: true });
    } catch (e) {
      console.warn(`Could not remove ${src}, probably locked.`);
    }
  }
}

// 1. Create directories
[pagesDir, layoutsDir, routesDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// 2. Move portals to pages
const portalsDir = path.join(appDir, 'portals');
if (fs.existsSync(portalsDir)) {
  ['admin', 'mod', 'vote', 'verify'].forEach(folder => {
    safeMove(path.join(portalsDir, folder), path.join(pagesDir, folder));
  });
}

// Move Landing Page
safeMove(path.join(appDir, 'page.jsx'), path.join(pagesDir, 'LandingPage.jsx'));
safeMove(path.join(appDir, 'home.css'), path.join(pagesDir, 'home.css'));

// 3. Rename components/ui to common
safeMove(path.join(srcDir, 'components', 'ui'), path.join(srcDir, 'components', 'common'));

// 4. Extract Layouts
const layoutMappings = [
  { src: path.join(pagesDir, 'admin', 'layout.jsx'), dest: path.join(layoutsDir, 'AdminLayout.jsx') },
  { src: path.join(pagesDir, 'mod', 'layout.jsx'), dest: path.join(layoutsDir, 'ModLayout.jsx') },
  { src: path.join(pagesDir, 'vote', 'layout.jsx'), dest: path.join(layoutsDir, 'VoteLayout.jsx') },
];

layoutMappings.forEach(mapping => {
  if (fs.existsSync(mapping.src)) {
    fs.cpSync(mapping.src, mapping.dest);
    try { fs.unlinkSync(mapping.src); } catch(e) {}
  }
});

// 5. Recursively fix imports across all files in src/
function fixImports(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Update relative imports to absolute alias `@/` for major folders
      const foldersToAlias = ['components', 'context', 'hooks', 'services', 'utils', 'pages', 'layouts', 'routes'];
      
      foldersToAlias.forEach(folder => {
        // Regex matches `from '../../context/...'` or `import '../../context/...'`
        const regex1 = new RegExp(`(from\\s+['"])(\\.\\.\\/)+${folder}(\\/|['"])`, 'g');
        content = content.replace(regex1, `$1@/${folder}$3`);
        
        const regex2 = new RegExp(`(import\\s+['"])(\\.\\.\\/)+${folder}(\\/|['"])`, 'g');
        content = content.replace(regex2, `$1@/${folder}$3`);
        
        // Also handle dynamic imports
        const regex3 = new RegExp(`(import\\(['"])(\\.\\.\\/)+${folder}(\\/|['"])`, 'g');
        content = content.replace(regex3, `$1@/${folder}$3`);
      });
      
      // Specific fix for LandingPage renaming and App.css
      content = content.replace(/['"]\.\/home\.css['"]/g, "'@/pages/home.css'");
      content = content.replace(/['"]\.\/App\.css['"]/g, "'@/App.css'");

      // Fix components/ui -> components/common if they are relative but not handled above
      content = content.replace(/components\/ui/g, 'components/common');

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  });
}

fixImports(srcDir);
console.log("Refactoring script completed.");
