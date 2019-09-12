const fs = require('fs');
const jsdom = require("jsdom");
const args = process.argv.slice(2);
if (args.length == 0) process.exit(1);

const contents = fs.readFileSync(args[0], 'utf8');
const dom = new jsdom.JSDOM(contents);
console.log(dom.window.document.querySelector("p").textContent);
