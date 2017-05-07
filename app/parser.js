function parse(lexemes) {
  let remaining = lexemes;
  let expressions = [];
  while (remaining.length > 0) {
    let [result, remainingLex] = l(remaining);
     //let [result, remainingLex]
    remaining = remainingLex;
    expressions.push(result);
  }
  return expressions;
}

const WithArgCommands = ["fd", "bk", "rt", "lt"];
const NoArgCommands = ["home", "clean", "cs"];

// L -> SC | repeat n [ {L} ]

function match(lexeme, type, value) {
  return lexeme.type === type &&
    (value ? lexeme.value.toLowerCase() === value.toLowerCase() : true);
}

function parseAsNoArgCommand(lexemes) {
  let toParse = lexemes[0];
  let result = match(toParse, "keyword");

  if (!result) {
    throw new Error("no arg command must be a keyword");
  }

  if (NoArgCommands.indexOf(toParse.value.toLowerCase()) > -1) {
    return [{
      type: "simple-no-arg",
      name: toParse.value.toLowerCase()
    }, lexemes.slice(1)];
  } else {
    throw new Error("cannot parse non no arg command");
  }
}

function parseAsSimpleCommand(lexemes) {
  if (lexemes.length < 1) {
    throw new Error("need at least 1");
  }

  let first = lexemes[0];
  if (match(first, "keyword")) {
    if (NoArgCommands.indexOf(first.value.toLowerCase()) > -1) {
      return parseAsNoArgCommand(lexemes);
    } else {
      return parseAsArgCommand(lexemes);
    }
  } else {
    throw new Error("unable to parse non key-word");
  }
}

function parseAsArgCommand(lexemes) {
  if (lexemes.length < 2) {
    throw new Error("cannot parse as arg command if lexeme length < 2");
  }

  let [command, arg] = lexemes;

  if (!match(command, "keyword") && match(arg, "number")) {
    throw new Error("wrong format: need arg after command");
  }

  if (WithArgCommands.indexOf(command.value.toLowerCase()) === -1) {
    throw new Error("unrecognized command");
  }

  if (!/^\d+(\.\d+)?$/.test(arg.value)) {
    throw new Error("command arg must be a number");
  }

  let result = {
    type: "simple-with-arg",
    name: command.value.toLowerCase(),
    arg: parseFloat(arg.value)
  };

  return [result, lexemes.slice(2)];
}

function l(lexemes) {
  let first = lexemes[0];
  if(match(first, "keyword", "repeat")) {
    return parseAsRepeat(lexemes);
  } else {
    return parseAsSimpleCommand(lexemes);
  }
}

function parseAsRepeat(lexemes) {
  if (lexemes.length < 4) {
    throw new Error("repeat clause needs at least 4 followers");
  }

  let [first, second, third] = lexemes;

  let matchResult  =
        match(first, "keyword", "repeat") && match(second, "number") && match(third, "blockStart");

  if (!matchResult) {
    throw new Error("repeat parse failed");
  }

  if (!/^\d+$/.test(second.value)) {
    throw new Error("repeat arg must be an integer");
  }

  let repeatParseResult = {
    type: "repeat",
    times: parseInt(second.value),
    subCommands: []
  };


  let remainingLexemes = lexemes.slice(3);
  if(match(remainingLexemes[0], "blockEnd")) {
    return [repeatParseResult, []];
  }

  while(true) {
    let [parsedResult, remaining] = l(remainingLexemes);
    repeatParseResult.subCommands.push(parsedResult);

    if (remaining.length === 0) {
      throw new Error("repeat unmatched paran");
    }

    let [firstRemaining] = remaining;

    if(match(firstRemaining, "blockEnd")) {
      return [repeatParseResult, remaining.slice(1)];
    }

    remainingLexemes = remaining;
  }
}

module.exports = parse;
