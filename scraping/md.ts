import { Glob } from "bun";
import * as path from "node:path";

const glob = new Glob("**/*.md");

const data = [];

for await (const file of glob.scan("pentesting-web")) {
  const content = await Bun.file(path.join("./pentesting-web", file)).text();
  const title = /^# (.*?)$/m.exec(content)?.[1];
  data.push({
    file,
    title,
    content: content.trim().replace(/<details>[^]*?<\/details>/, ""),
  });
}
