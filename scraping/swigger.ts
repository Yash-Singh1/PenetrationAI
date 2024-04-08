const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const article = await fetch(
  "https://portswigger.net/research/server-side-prototype-pollution"
).then((res) => res.text());

const dom = new JSDOM(article);
const document = dom.window.document;

await Bun.write(
  Bun.file("protoserver.txt"),
  document.querySelector(".section").textContent
);
