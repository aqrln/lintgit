'use strict';

const tagger = require('./tagger');

const linter = {};
module.exports = linter;

linter.lint = (messageText) => {
  const message = linter.parse(messageText);
  const errors = []
    .concat(linter.lintLineLength(message))
    .concat(linter.lintVerb(message))
    .concat(linter.lintCase(message));
  return errors;
};

linter.parse = (messageText) => {
  const parsedMessage = {};
  const lines = messageText.split('\n');

  parsedMessage.shortMessage = lines[0];
  parsedMessage.fullMessage = messageText;
  parsedMessage.secondLine = lines[1] || '';
  parsedMessage.messageBodyLines = lines.slice(2);

  const colonIndex = lines[0].indexOf(':');
  if (colonIndex !== -1) {
    parsedMessage.tagsString = lines[0].slice(0, colonIndex);
    parsedMessage.tags = parsedMessage.tagsString
      .split(',')
      .map(tag => tag.trim());
    parsedMessage.shortMessageNoTags = lines[0].slice(colonIndex + 1).trim();
  } else {
    parsedMessage.tagsString = '';
    parsedMessage.tags = [];
    parsedMessage.shortMessageNoTags = lines[0];
  }

  return parsedMessage;
};

linter.lintLineLength = (message) => {
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

linter.lintVerb = (message) => {
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

linter.lintCase = (message) => {
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
