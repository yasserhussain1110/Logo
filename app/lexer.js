/*
 Expression examples -

 fd 40
 rt 90
 repeat 4 [fd 40 rt 90]
 home
 repeat 4 [home]

 keywords - repeat, fd, rt, home, etc
 values - 90, 20, etc
 separator - [,]
 */


function createStream(content) {
  let index = -1;
  return {
    next: function() {
      return content[++index];
    },

    back: function() {
      index--;
    },

    isEmpty: function() {
      return index >= content.length;
    },

    peek: function() {
      return content[index+1];
    }
  };
}

function lex(stream) {
  let result = [];
  let possibleWord = "";
  while(!stream.isEmpty()) {
    let char = stream.next();

    if (/\s+/.test(char)) {
      continue;
    }

    if (char === '[') {
      result.push({
        type: "blockStart"
      });

      possibleWord = "";

      continue;
    }

    if (char === "]") {
      result.push({
        type: "blockEnd"
      });

      continue;
    }

    possibleWord += char;

    if (isKeyword(possibleWord)) {
      result.push({
        type: "keyword",
        value: possibleWord
      });

      possibleWord = "";

      continue;
    }

    if (isNumber(possibleWord)) {
      if (!isNumber(possibleWord+stream.peek())) {
        result.push({
          type: "number",
          value: possibleWord
        });

        possibleWord = "";

        continue;
      }
    }
  }

  return result;
}

const KEYWORDS = ["repeat", "fd", "rt", "bk", "lt", "home", "clear"];

function isKeyword(word) {
  return KEYWORDS.indexOf(word) > -1;
}

function isNumber(word) {
  return /^\d+(.\d+)?$/.test(word);
}

function isDelim(char) {
  return char === undefined || /^[\s\[\]]$/.test(char);
}

function isNumberDelim(char) {
  return isDelim(char) || /^[^\.\d]$/.test(char);
}

module.exports = function(content) {
  return lex(createStream(content));
};
