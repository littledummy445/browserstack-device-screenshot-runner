const fs = require('fs');
const path = require('path');
const { remote } = require('webdriverio');

async function run() {
  const username = process.env.BROWSERSTACK_USERNAME;
  const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;

  if (!username || !accessKey) {
    throw new Error(
      'Missing BROWSERSTACK_USERNAME or BROWSERSTACK_ACCESS_KEY environment variables.'
    );
  }

  const deviceName = process.env.BS_DEVICE_NAME || 'Google Pixel 8';
  const osVersion = process.env.BS_OS_VERSION || '14.0';
  const targetUrl = process.env.TARGET_URL || 'https://example.com';

  const outDir = path.resolve(process.cwd(), 'screenshots');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await remote({
    protocol: 'https',
    hostname: 'hub.browserstack.com',
    port: 443,
    path: '/wd/hub',
    user: username,
    key: accessKey,
    capabilities: {
      platformName: 'Android',
      'appium:deviceName': deviceName,
      'appium:platformVersion': osVersion,
      'appium:automationName': 'UiAutomator2',
      'bstack:options': {
        projectName: process.env.BROWSERSTACK_PROJECT_NAME || 'Device Screenshot Runner',
        buildName: process.env.BROWSERSTACK_BUILD_NAME || 'GitHub Actions Run',
        sessionName: `Screenshots - ${deviceName} (${osVersion})`
      }
    }
  });

  try {
    // 1. Capture device home / initial screen before navigating
    const homeShot = path.join(outDir, '01-initial-screen.png');
    await browser.saveScreenshot(homeShot);
    console.log(`Saved ${homeShot}`);

    // 2. Open target URL in mobile Chrome on the device
    await browser.url(targetUrl);
    await browser.pause(2000);

    const pageShot = path.join(outDir, '02-target-page.png');
    await browser.saveScreenshot(pageShot);
    console.log(`Saved ${pageShot}`);

    // Mark session as passed in BrowserStack Automate
    await browser.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason":"Captured device screenshots"}}',
      []
    );
  } catch (err) {
    await browser.executeScript(
      `browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason":${JSON.stringify(err.message)}}}`,
      []
    );
    throw err;
  } finally {
    await browser.deleteSession();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
