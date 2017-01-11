'use strict';

const fs = require('fs');
const path = require('path');

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

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

function doPromise(generator) {
  const sequence = generator();
  return step();

  function step(value) {
    const result = sequence.next(value);
    if (result.done) {
      return result.value;
    }
    return result.value.then(step);
  }
}

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
  throw err;
});

function loadFiles(dir) {
  return doPromise(function*() {
    const filenames = yield readdir(dir);
    for (const fname of filenames) {
      const fullName = path.join(dir, fname);
      const stats = yield stat(fullName);
      if (stats.isDirectory()) {
        yield loadFiles(fullName);
      } else if (stats.isFile() && fname.endsWith('.test.js')) {
        loadTests(fullName);
      }
    }
  });
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
