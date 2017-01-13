'use strict';

const fs = require('fs');
const path = require('path');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

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

loadFiles(__dirname).then(() => {
  console.log(`Loaded ${tests.length} test(s)`);
  process.nextTick(runTests);
}).catch((err) => {
  console.error('' + err);
  process.exit(1);
});

function loadFiles(dir) {
  return readdir(dir).then((filenames) =>
    Promise.all(filenames.map((name) => {
      const fullName = path.join(dir, name);
      return stat(fullName).then((stats) => {
        if (stats.isDirectory()) {
          return loadFiles(fullName);
        } else if (stats.isFile() && fullName.endsWith('.test.js')) {
          return loadTests(fullName);
        }
      });
    }))
  );
}

function loadTests(filename) {
  const exports = require(filename);
  Object.keys(exports).forEach((key) => {
    const value = exports[key];
    if (typeof(value) === 'function' && key.startsWith('test')) {
      const moduleName = path
        .relative(__dirname, filename)
        .slice(0, -'.test.js'.length);
      tests.push({ name: key, moduleName, fn: value });
    }
  });
}

function promisify(fn) {
  return (...args) => (
    new Promise((resolve, reject) => {
      fn(...args, (err, ...results) => {
        if (err) {
          reject(err);
        } else {
          resolve(...results);
        }
      });
    })
  );
}
