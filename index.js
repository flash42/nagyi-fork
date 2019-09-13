const fs = require('fs');
const jsdom = require("jsdom");
const args = process.argv.slice(2);
if (args.length == 0) process.exit(1);

const contents = fs.readFileSync(args[0], 'utf8');
const dom = new jsdom.JSDOM(contents);
const productDivs = Array.from(dom.window.document.getElementsByClassName("product-box"));
const results = productDivs.map(div => {
    let size = Array.from(div.getElementsByTagName("li")).filter(e => e.textContent.match(/.*Képátló \(cm\):.*/)).map(e => e.textContent.match(/[0-9]+/))[0]
    if (size != null) {
	size = size[0]
    } else {
	size = -1;
    }
    const productName = Array.from(div.getElementsByTagName("h2")[0].getElementsByTagName("a"))[0].textContent;
    const productNameParts = productName.split(" ");
    const priceMatch = div.getElementsByClassName("price")[0].textContent.match(/[0-9 ]+/);
    const price = priceMatch != null ? priceMatch[0].replace(/ /g, "") : -1;
    return {size, product: productNameParts[productNameParts.length - 1], price}
})
const upcTvs = JSON.parse(fs.readFileSync('tvs', 'utf8')).upc.map(e => e.title);
const filteredResults = results.filter(e => upcTvs.includes(e.product));
console.log(filteredResults.sort((a, b) => a.price - b.price))
fs.writeFileSync("output", JSON.stringify({results}));
