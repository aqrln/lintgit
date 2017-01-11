'use strict';

const assert = require('assert');
const tagger = require('../lib/tagger');

exports.testAdd = () => {
  const [word, tag] = tagger.tagFirstWord('Add a file');
  assert.strictEqual(word, 'add');
  assert.strictEqual(tagger.getTagDescription(tag), 'imperative verb');
  assert.ok(tagger.isImperativeVerb(tag));
};

exports.testFix = () => {
  const [word, tag] = tagger.tagFirstWord('Fix a bug');
  assert.strictEqual(word, 'fix');
  assert.strictEqual(tagger.getTagDescription(tag), 'imperative verb');
  assert.ok(tagger.isImperativeVerb(tag));
};

exports.testImplement = () => {
  const [word, tag] = tagger.tagFirstWord('Implement a feature');
  assert.strictEqual(word, 'implement');
  assert.strictEqual(tagger.getTagDescription(tag), 'imperative verb');
  assert.ok(tagger.isImperativeVerb(tag));
};

exports.testRefactor = () => {
  const [word, tag] = tagger.tagFirstWord('Refactor code');
  assert.strictEqual(word, 'refactor');
  assert.strictEqual(tagger.getTagDescription(tag), 'imperative verb');
  assert.ok(tagger.isImperativeVerb(tag));
};

exports.testFixed = () => {
  const [word, tag] = tagger.tagFirstWord('Fixed a bug');
  assert.strictEqual(word, 'fixed');
  assert.strictEqual(tagger.getTagDescription(tag), 'verb in past tense');
  assert.ok(!tagger.isImperativeVerb(tag));
};

exports.testMinor = () => {
  const [word, tag] = tagger.tagFirstWord('Minor changes');
  assert.strictEqual(word, 'minor');
  assert.strictEqual(tagger.getTagDescription(tag), 'adjective');
  assert.ok(!tagger.isImperativeVerb(tag));
};
