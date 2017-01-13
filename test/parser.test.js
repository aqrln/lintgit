'use strict';

const assert = require('assert');
const parser = require('../lib/parser');

exports.testSingleLineNoTags = () => {
  const message = parser.parse('Add some feature');
  assert.deepStrictEqual(message, {
    shortMessage: 'Add some feature',
    shortMessageNoTags: 'Add some feature',
    fullMessage: 'Add some feature',
    secondLine: '',
    messageBodyLines: [],
    tagsString: '',
    tags: []
  });
};

exports.testSingleLineTag = () => {
  const message = parser.parse('core: add some feature');
  assert.deepStrictEqual(message, {
    shortMessage: 'core: add some feature',
    shortMessageNoTags: 'add some feature',
    fullMessage: 'core: add some feature',
    secondLine: '',
    messageBodyLines: [],
    tagsString: 'core',
    tags: ['core']
  });
};

exports.testSingleLineManyTags = () => {
  const message = parser.parse('core,test: add some feature');
  assert.deepStrictEqual(message, {
    shortMessage: 'core,test: add some feature',
    shortMessageNoTags: 'add some feature',
    fullMessage: 'core,test: add some feature',
    secondLine: '',
    messageBodyLines: [],
    tagsString: 'core,test',
    tags: ['core', 'test']
  });
};

const COMMIT_WITH_DESCRIPTION = `\
core: add some feature

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sem orci,
volutpat viverra eleifend eu, maximus ut tellus. Pellentesque sit amet
consequat nisl. Mauris dictum posuere nibh, fringilla interdum mi
rhoncus id.
`;

exports.testCommitWithDescription = () => {
  const message = parser.parse(COMMIT_WITH_DESCRIPTION);
  assert.deepStrictEqual(message, {
    shortMessage: 'core: add some feature',
    shortMessageNoTags: 'add some feature',
    fullMessage: COMMIT_WITH_DESCRIPTION,
    secondLine: '',
    messageBodyLines: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
        'Donec sem orci,',
      'volutpat viverra eleifend eu, maximus ut tellus. Pellentesque sit amet',
      'consequat nisl. Mauris dictum posuere nibh, fringilla interdum mi',
      'rhoncus id.',
      ''
    ],
    tagsString: 'core',
    tags: ['core']
  });
};

const MISSING_BLANK_LINE_COMMIT = `\
Add some feature
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sem orci,
volutpat viverra eleifend eu, maximus ut tellus.
`;

exports.testMissingBlankLineCommit = () => {
  const message = parser.parse(MISSING_BLANK_LINE_COMMIT);
  assert.deepStrictEqual(message, {
    shortMessage: 'Add some feature',
    shortMessageNoTags: 'Add some feature',
    fullMessage: MISSING_BLANK_LINE_COMMIT,
    secondLine: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Donec sem orci,',
    messageBodyLines: [
      'volutpat viverra eleifend eu, maximus ut tellus.',
      ''
    ],
    tagsString: '',
    tags: []
  });
};
