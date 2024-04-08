const jsdom = require("jsdom");
const { JSDOM } = jsdom;

import data from "./data.json";

const output = [];

try {
  for (const item of data) {
    const html = await fetch(item).then((res) => res.text());
    const dom = new JSDOM(html);
    const document = dom.window.document;
    process.stdout.write(item + "...");
    const text = document.querySelector(
      "#lesson > div.lesson__content"
    ).textContent;
    const title = document.querySelector(
      "#lesson > div.lesson__content > div.lesson__header > h1"
    ).textContent;
    console.log("done " + title);
    output.push({ title, text, url: item });
  }
} finally {
  await Bun.write("./dataout.json", JSON.stringify(output, null, 2));
}
