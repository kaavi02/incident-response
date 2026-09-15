const fs = require('fs');
let html = fs.readFileSync('stitch_dashboard.html', 'utf8');
let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

if (bodyMatch) {
  let body = bodyMatch[1];
  
  // Convert HTML to basic JSX
  body = body.replace(/class=/g, 'className=')
             .replace(/for=/g, 'htmlFor=')
             .replace(/<!--[\s\S]*?-->/g, '')
             .replace(/<input([^>]*[^\/])>/g, '<input$1 />')
             .replace(/<img([^>]*[^\/])>/g, '<img$1 />');

  // Basic style="" to style={{}} conversion
  body = body.replace(/style="([^"]*)"/g, (match, styles) => {
    let styleObj = styles.split(';').filter(Boolean).map(s => {
      let parts = s.split(':');
      if (parts.length < 2) return '';
      let k = parts[0].trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      let v = parts.slice(1).join(':').trim();
      return `${k}: '${v}'`;
    }).join(', ');
    return `style={{ ${styleObj} }}`;
  });

  fs.writeFileSync('src/app/page.tsx', `export default function Dashboard() { return (<>\n${body}\n</>); }\n`);
  console.log("Successfully converted to src/app/page.tsx");
} else {
  console.log("Body not found");
}
