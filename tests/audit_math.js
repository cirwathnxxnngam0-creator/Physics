const fs = require('fs');
const path = require('path');
const Renderer = require('../js/math_renderer.js');

const content = fs.readFileSync('physicsnoza_v3/js/data/projectile_content.js', 'utf8');
const mathRegex = /\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g;
let match;
const allMath = new Set();
while ((match = mathRegex.exec(content)) !== null) {
  const expr = (match[1] || match[2]).trim();
  if (expr) allMath.add(expr);
}

console.log('Total unique math formulas:', allMath.size);

const unrenderedIssues = [];

for (const expr of allMath) {
  const rendered = Renderer.renderLatex(expr);
  // Check if unhandled backslash commands remain
  const remainingCommands = rendered.match(/\\[a-zA-Z]+/g);
  if (remainingCommands) {
    unrenderedIssues.push({ expr, remainingCommands, rendered });
  }
}

console.log('Formulas with unhandled LaTeX commands:', unrenderedIssues.length);
if (unrenderedIssues.length > 0) {
  console.log(JSON.stringify(unrenderedIssues, null, 2));
}
