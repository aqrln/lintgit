'use strict';

const tagger = require('./tagger');

const rules = {};
module.exports = rules;

// All the rule functions take a message object generated with parser.parse()
// as their arguments and return arrays of errors.

// Checks whether line length conditions are met, i.e.,
//  (a) short commit message is not longer than 50 characters (except it's a
//      merge commit or revert commit),
//  (b) full commit message is wrapped at 72 characters.
//
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

// Checks that the first word of the short commit message (after
// tags/subsystems, if any) is an imperative verb. This rule has an exception
// with a noun as the first word: release commits that follow the pattern
// "Version x.y.z".
//
rules.lintVerb = (message) => {
  if (/^Version \d+\.\d+\.\d+$/.test(message.shortMessage)) {
    return [];
  }
  const [word, tag] = tagger.tagFirstWord(message.shortMessageNoTags);
  if (!tagger.isImperativeVerb(tag)) {
    const description = tagger.getTagDescription(tag);
    return [`Expected imperative verb, got ${description}: ${word}`];
  }
  return [];
};

// Checks that:
//   (a) tags/subsystems are lowercase letters,
//   (b) commit message starts with an uppercase letter if there are no
//       tags/subsystems or with a lowercase leter otherwise.
//
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

// Checks that the whitespaces are used correctly with tags/subsystems:
//   (a) there must be no spaces around commas,
//   (b) there must be a space after the colon.
//
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

// Checks that the short commit message does not end with a period.
//
rules.lintNoTrailingPeriod = (message) => {
  if (message.shortMessage.endsWith('.')) {
    return ['Short commit message must not end with a period'];
  }
  return [];
};
