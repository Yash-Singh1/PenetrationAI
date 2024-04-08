const xml = await fetch("https://learn.snyk.io/sitemap.xml").then((res) =>
  res.text()
);

import xmlParser from "xml-parser";

console.log(
  xmlParser(xml).root.children.flatMap((child) =>
    child.children
      .filter(
        (child) =>
          child.name === "loc" &&
          child.content.startsWith("https://learn.snyk.io/lesson/")
      )
      .map((child) => child.content)
  )
);

export {};
