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
      res.push({
        key: data?.key,
        type: data?.mode,
        link: data?.link,
      });
    }
  };
  data.forEach((item) => {
    const path = [];
    backTracking(item, path);
  });
  return res;
}

async function scrape() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const p = path.resolve("playgroundEx", "../examples/config.json");
    const config = JSON.parse(fs.readFileSync(p));
    const examples = findPath(config.topic);
    const pages = await browser.pages();
    const page = pages[0];
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });
    for (const example of examples) {
      const { type, key, link } = example;
      try {
        spinner.start();
        if (type === "playground") {
          await page.goto(
            `http://127.0.0.1:${port}/examples/#/playground#${key}`
          );
          await waitTime(5000);
          const rs = await page.$eval(".urlDiv", (el) => el.textContent);
          if (rs && rs !== "nothing") {
            const iframe = await browser.newPage();
            await iframe.goto(rs);
            await iframe.screenshot({
              path: `src/screenshots/${key}.png`,
            });
            await iframe.close();
          }
        } else if (type === "link" && link) {
          if (link.includes("http")) {
            await page.goto(link);
          } else {
            await page.goto(`https://site.logic-flow.cn/${link}`);
          }
          await page.screenshot({
            path: `src/screenshots/${key}.png`,
          });
        }
        spinner.succeed(`Screenshot of ${key} saved!`);
      } catch (error) {
        spinner.fail(
          `Could not save the screenshot of ${key} because of ${error}!`
        );
      }
    }
    await page.close();
    await browser.close();
  } catch (error) {
    console.log(error);
  }
}
scrape();
