import fs from "fs";
import path from "path";
import ora from "ora";
const spinner = ora({ text: "wait a minute..." });

import puppeteer from "puppeteer";

const port = "5000";

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

function findPath(data) {
  if (!data) return;
  const res = [];
  const backTracking = (data, path) => {
    const tmp = data.children || data.examples;
    if (tmp) {
      path.push(data.key || data.name);
      tmp.forEach((i) => {
        backTracking(i, path);
      });
      path.pop();
    } else {
      res.push(data.key);
    }
  };
  data.forEach((item) => {
    const path = [];
    backTracking(item, path);
  });
  return res;
}

async function scrape() {
  const browser = await puppeteer.launch({ headless: true });
  const p = path.resolve("playgroundEx", "../examples/config.json");
  const config = JSON.parse(fs.readFileSync(p));
  const examples = findPath(config.topic);
  for (const example of examples) {
    const pages = await browser.pages();
    const page = pages[0];
    try {
      spinner.start();
      await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
      });
      await page.goto(
        `http://127.0.0.1:${port}/examples/#/playground#${example}`
      );
      await waitTime(4000);
      const rs = await page.$eval(".urlDiv", (el) => el.textContent);
      const iframe = await browser.newPage();
      await iframe.goto(rs);
      await iframe.screenshot({
        path: `src/screenshots/${example}.png`,
      });
      await page.close();
      spinner.succeed(`Screenshot of ${example} saved!`);
    } catch (error) {
      spinner.error(`Could not save screenshot of ${example}!`);
    }
  }
  await browser.close();
}
scrape();
