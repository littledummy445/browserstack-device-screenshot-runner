const test = require('node:test');
const assert = require('node:assert/strict');
const { buildCapabilities } = require('./take-screenshots');

test('builds valid Chrome capabilities for an Android real device', () => {
  const capabilities = buildCapabilities('Google Pixel 8', '14.0');

  assert.equal(capabilities.platformName, 'Android');
  assert.equal(capabilities.browserName, 'Chrome');
  assert.equal(capabilities['appium:deviceName'], 'Google Pixel 8');
  assert.equal(capabilities['appium:platformVersion'], '14.0');
  assert.equal(capabilities['appium:automationName'], 'UiAutomator2');
});
