const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');
content = content.replace(/fontVariationSettings:\s*''FILL'\s*1'/g, "fontVariationSettings: '\"FILL\" 1'");
fs.writeFileSync('src/app/page.tsx', content);
