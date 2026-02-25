import puppeteer from "puppeteer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const PANEL_URL = process.env.PANEL_URL;
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;
const REPO_DIR = "./game-eggs";

const colors = { reset: "\x1b[0m", green: "\x1b[32m", yellow: "\x1b[33m", red: "\x1b[31m" };

(async () => {
  const rawEggs = JSON.parse(fs.readFileSync("./eggs.json", "utf-8"));
  const eggsData = Object.entries(rawEggs).map(([gameName, paths]) => ({
    name: gameName,
    jsonFiles: paths,
  }));

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"]
  });

  const page = await browser.newPage();

  await page.goto(`${PANEL_URL}/auth/login`, { waitUntil: "networkidle2" });
  await page.type('input[name="username"]', EMAIL);
  await page.type('input[name="password"]', PASSWORD);
  await Promise.all([page.click('button[type="submit"]'), page.waitForNavigation()]);

  for (const eggGroup of eggsData) {
    console.log(`${colors.yellow}➡ Creating Nest: ${eggGroup.name}${colors.reset}`);
    await page.goto(`${PANEL_URL}/admin/nests/new`);
    await page.type('input[name="name"]', eggGroup.name);
    await Promise.all([page.click('button[type="submit"]'), page.waitForNavigation()]);

    for (const eggPath of eggGroup.jsonFiles) {
      const fullPath = path.resolve(REPO_DIR, eggPath);
      await page.goto(`${PANEL_URL}/admin/nests`, { waitUntil: "networkidle2" });

      await page.waitForSelector('a[data-target="#importServiceOptionModal"]');
      await page.click('a[data-target="#importServiceOptionModal"]');

      await page.waitForSelector("#importServiceOptionModal", { visible: true });
      await new Promise(r => setTimeout(r, 1000));

      console.log(`  Attempting to select Nest: ${eggGroup.name}...`);
      const selectionSuccess = await page.evaluate((name) => {
        const $select = window.$('#pImportToNest');
        if ($select.length > 0) {
          const val = $select.find(`option:contains("${name}")`).val();
          if (val) {
            $select.val(val).trigger('change');
            return true;
          }
        }
        return false;
      }, eggGroup.name);

      if (!selectionSuccess) {
        console.log(`${colors.red}  ❌ Automatic selection failed, trying manual click...${colors.reset}`);
        await page.click('.select2-selection--single');
        await new Promise(r => setTimeout(r, 500));
        await page.evaluate((name) => {
          const options = Array.from(document.querySelectorAll('.select2-results__option'));
          const target = options.find(opt => opt.textContent.includes(name));
          if (target) target.click();
        }, eggGroup.name);
      }

      const inputFile = await page.$('input#pImportFile');
      await inputFile.uploadFile(fullPath);

      console.log(`${colors.green}  ✅ File injected. Sending form...${colors.reset}`);
      await new Promise(r => setTimeout(r, 800));
      await Promise.all([
        page.click('#importServiceOptionModal button[type="submit"]'),
        page.waitForNavigation({ waitUntil: "networkidle2" })
      ]);
    }
  }
  console.log(`\n🎉 Completed.`);
})();