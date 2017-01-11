'use strict';

const pos = require('pos');

const taggerApi = {};
module.exports = taggerApi;

const lexer = new pos.Lexer();
const tagger = new pos.Tagger();

tagger.extendLexicon({
  refactor: ['VB']
});

taggerApi.tagFirstWord = (message) => {
  const preprocessedMessage = message.toLowerCase();
  const lexems = lexer.lex(preprocessedMessage);
  const tags = tagger.tag(lexems);
  return tags[0];
};

taggerApi.isImperativeVerb = (tag) => tag === 'VB';

taggerApi.getTagDescription = (tag) => {
  if (tag === 'CC') {
    return 'conjunction';
  } else if (['CD', 'LS'].includes(tag)) {
    return 'cardinal number';
  } else if (['DT', 'WDT'].includes(tag)) {
    return 'determiner or article';
  } else if (['EX', 'RB', 'RBR', 'RBS', 'WRB'].includes(tag)) {
    return 'adverb';
  } else if (['IN', 'TO'].includes(tag)) {
    return 'preposition';
  } else if (['JJ', 'JJR', 'JJS'].includes(tag)) {
    return 'adjective';
  } else if (tag === 'MD') {
    return 'modal verb';
  } else if (['NN', 'NNS', 'NNP', 'NNPS'].includes(tag)) {
    return 'noun';
  } else if (tag === 'POS') {
    return 'possesive ending';
  } else if (tag === 'PDT') {
    return 'predeterminer';
  } else if (['PP$', 'PRP$', 'PRP', 'WP', 'WP$'].includes(tag)) {
    return 'pronoun';
  } else if (tag === 'RP') {
    return 'particle';
  } else if (tag === 'UH') {
    return 'interjection';
  } else if (tag === 'VB') {
    return 'imperative verb';
  } else if (tag === 'VBD') {
    return 'verb in past tense';
  } else if (tag === 'VBG') {
    return 'gerund';
  } else if (tag === 'VBN') {
    return 'verb in past participle';
  } else if (['VBP', 'VBZ'].includes(tag)) {
    return 'verb in present tense';
  } else if (['SYM', ',', '.', ':', '$', '#', '"', '(', ')'].includes(tag)) {
    return 'symbol';
  }
};
