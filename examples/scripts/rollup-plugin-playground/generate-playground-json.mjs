import path from 'path';
import fs from 'fs';

function findPath(data) {
  if (!data) return;
  const res = [];
  const backTracking = (data, path) => {
    const tmp = data.children || data.examples;
    if (tmp) {
      path.push(data.key || data.name);
      tmp.forEach((i) => {
        const r = backTracking(i, path);
        if (r) {
          res.push([...path, r]);
        }
      });
      path.pop();
    } else {
      return data.key;
    }
  };
  data.forEach((item) => {
    const path = [];
    backTracking(item, path);
  });
  return res;
}

export default function generatePlaygroundJson() {
  const configPath = path.resolve('playgroundEx', '../examples/config.json');
  const topics = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const playgroundPath = findPath(topics.topic);
  const playgroundPathStr = playgroundPath.map((item) => item.join('/'));
  const jsonObject = {};

  for (let index = 0; index < playgroundPathStr.length; index++) {
    const jsonFiles = {};
    const p = path.resolve(
      'playgroundEx',
      '../examples',
      playgroundPathStr[index],
    );
    const files = fs.readdirSync(p);
    files.forEach((file) => {
      const filePath = path.resolve(p, file);
      const content = fs.readFileSync(filePath, 'utf8');
      jsonFiles[file] = {
        content,
      };
    });
    const el = playgroundPath[index];
    jsonObject[el[el.length - 1]] = {
      files: jsonFiles,
    };
  }
  return jsonObject;
}
