'use strict';

const fs = require('fs');
const path = require('path');

const tests = [];

function runTests() {
  if (tests.length === 0) {
    console.log('OK');
    return;
  }
  const test = tests.shift();
  console.log(`# ${test.moduleName}/${test.name}`);
  test.fn();
  process.nextTick(runTests);
}

fs.readdir(__dirname, (err, files) => {
  if (err) throw err;
  const testFiles = files.filter(filename => filename.endsWith('.test.js'));
  testFiles.forEach(loadTests);
  console.log(`Loaded ${tests.length} test(s)`);
  process.nextTick(runTests);
});

function loadTests(filename) {
  const exports = require(path.join(__dirname, filename));
  Object.keys(exports).forEach((key) => {
    const value = exports[key];
    if (typeof(value) === 'function' && key.startsWith('test')) {
      tests.push({
        name: key,
        moduleName: filename.slice(0, -'.test.js'.length),
        fn: value
      });
    }
  });
}
