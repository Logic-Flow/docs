import fs from "fs";
import path from "path";

export default function generateConfig() {
  const playgroundPath = path.resolve("playgroundEx", "../examples");
  const files = fs.readdirSync(playgroundPath);
  const topics = files.filter((item) => !item.includes("."));
  const jsonConfig = {
    topic: [],
  };

  for (const topic of topics) {
    const p = path.resolve(`${playgroundPath}/${topic}`);
    const children = fs.readdirSync(p);
    const filterChildren = children.filter((item) => !item.includes("."));
    // const p1 = path.resolve(`${playgroundPath}/${topic}/config.json`);
    // const conf = JSON.parse(fs.readFileSync(p1, 'utf-8'));
    const conf = {
      name: topic,
    };
    conf.children = [];
    for (const child of filterChildren) {
      const examples = fs.readFileSync(
        `${playgroundPath}/${topic}/${child}/config.json`,
        "utf-8"
      );
      conf.children.push(JSON.parse(examples));
    }
    jsonConfig.topic.push(conf);
  }
  return jsonConfig;
}
