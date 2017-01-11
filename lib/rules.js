'use strict';

const tagger = require('./tagger');

const rules = {};
module.exports = rules;

rules.lintLineLength = (message) => {
  const errors = [];

  if (message.shortMessage.length > 50 &&
      !message.shortMessage.startsWith('Revert ') &&
      !message.shortMessage.startsWith('Merge ')) {
    errors.push('First line length must not be greater than 50 characters');
  }

  if (message.secondLine.length > 0) {
    errors.push('Second line must be empty');
  }

  let messageBodyNotWrapped = false;
  message.messageBodyLines.forEach((line) => {
    if (line.length > 72) {
      messageBodyNotWrapped = true;
    }
  });
  if (messageBodyNotWrapped) {
    errors.push('Full message must be wrapped at 72 characters');
  }

  return errors;
};

rules.lintVerb = (message) => {
  if (/^Version \d+\.\d+\.\d+$/.test(message.shortMessage)) {
    // Release commits are an exception to the rule
    return [];
  }
  const [word, tag] = tagger.tagFirstWord(message.shortMessageNoTags);
  if (!tagger.isImperativeVerb(tag)) {
    const description = tagger.getTagDescription(tag);
    return [`Expected imperative verb, got ${description}: ${word}`];
  }
  return [];
};

rules.lintCase = (message) => {
  const errors = [];
  if (message.tags.length > 0) {
    message.tags.forEach((tag) => {
      if (!/^[a-z]+$/.test(tag)) {
        errors.push(`Tag ${tag} must consist of lowercase latin letters only`);
      }
    });
    if (!/[a-z]/.test(message.shortMessageNoTags[0])) {
      errors.push('Text after colon must start with a lowercase letter');
    }
  } else if (!/[A-Z]/.test(message.shortMessage[0])) {
    errors.push('Commit message without tags ' +
      'must start with an uppercase letter');
  }
  return errors;
};

rules.lintWhitespace = (message) => {
  if (message.tags.length === 0) {
    return [];
  }

  const errors = [];

  const tags = message.tagsString;
  let spaceInsideTags = false;
  for (let i = tags.indexOf(','); i !== -1; i = tags.indexOf(',', i + 1)) {
    if (/\s/.test(tags[i + 1])) {
      spaceInsideTags = true;
    }
  }
  if (spaceInsideTags) {
    errors.push('There must be no spaces between tags');
  }

  const colonIndex = message.shortMessage.indexOf(':');
  if (message.shortMessage[colonIndex + 1] !== ' ') {
    errors.push('There must be a space after the colon');
  }

  return errors;
};
