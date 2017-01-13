'use strict';

const fs = require('fs');
const path = require('path');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const tests = [];
let currentTest = 0;
let prevModuleName = '';

loadFiles(__dirname).then(() => {
  console.log(`1..${tests.length}`);
  process.nextTick(runTests);
}).catch((err) => {
  console.error('' + err);
  process.exit(1);
});

function runTests() {
  if (currentTest >= tests.length) {
    return;
  }

  const test = tests[currentTest++];
  const outputLine = ` ${currentTest} - ${test.moduleName}/${test.name}`;

  if (test.moduleName !== prevModuleName) {
    console.log('# ' + test.moduleName);
    prevModuleName = test.moduleName;
  }

  try {
    test.fn();
    console.log('ok' + outputLine);
  } catch (err) {
    console.log('not ok' + outputLine);
    console.error('' + err, err.stack);
  }

  process.nextTick(runTests);
}

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
