import fs from "fs";
import path from "path";
import generateConfig from "./generate-config";

function generateExamplesConfig() {
  return new Promise((resolve) => {
    const jsonConfig = generateConfig();
    const targetDir = path.resolve("examples/config.json");
    fs.writeFileSync(targetDir, JSON.stringify(jsonConfig));
    resolve();
  });
}

export default function examplesConfig() {
  return {
    name: "generateExamplesConfig",
    buildStart: async function () {
      await generateExamplesConfig();
    },
  };
}
