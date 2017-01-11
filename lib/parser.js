'use strict';

const parser = {};
module.exports = parser;

// Parses a commit message as a string into a message object suitable for
// passing into rule linter functions
//
parser.parse = (messageText) => {
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
