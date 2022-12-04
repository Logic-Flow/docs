import fs from "fs";
import path from "path";
import generatePlaygroundJson from "./generate-playground-json.mjs";

function copyPlaygroundJson() {
  return new Promise((resolve) => {
    const targetDir = path.resolve("public/playground_json");
    const jsonObject = generatePlaygroundJson();
    Object.keys(jsonObject).forEach((key) => {
      const exampleJsonPath = path.resolve(targetDir, `${key}.playground.json`);
      fs.writeFileSync(exampleJsonPath, JSON.stringify(jsonObject[key]));
    });
    resolve();
  });
}

export default function playgroundJson() {
  return {
    name: "playgroundJson",
    buildStart: async () => {
      await copyPlaygroundJson();
    },
  };
}
