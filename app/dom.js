let history = [];
let historyIndex = 0;
let incompleteCommand = "";

const lex = require('./lexer');
const parse = require('./parser');
const commandExecute = require('./executer');

function addListeners () {
  document.querySelector("input.command").addEventListener("keydown", function(e) {
    if (e.keyCode === 13) {
      execute();
    } else if (e.keyCode === 38) {
      showHistoryPrev();
      e.preventDefault();
    } else if (e.keyCode === 40) {
      showHistoryNext();
      e.preventDefault();
    } else {
      incompleteCommand += e.key;
    }
  });
}

function showHistoryNext() {
  if (historyIndex + 1 <= history.length - 1) {
    historyIndex++;
    setCommand(history[historyIndex]);
  } else {
    historyIndex = history.length;
    setCommand(incompleteCommand);
  }
}

function showHistoryPrev() {
  if (historyIndex >= 1) {
    historyIndex--;
    setCommand(history[historyIndex]);
  }
}

function setCommand(command) {
  document.querySelector(".command").value = command;
}

function getCommand() {
  return document.querySelector(".command").value;
}

function print(val) {
  let shellPrompt = document.getElementsByClassName("prompt")[0];
  let outputs = document.getElementsByClassName("output");
  let output = outputs[outputs.length - 1];
  let cln = output.cloneNode(true);
  cln.innerHTML = val;
  let logoConsole = document.getElementsByClassName("console")[0];
  logoConsole.insertBefore(cln, shellPrompt);
  logoConsole.scrollTop = logoConsole.scrollHeight;
}

function execute() {
  incompleteCommand = "";
  let command = getCommand();
  history.push(command);
  historyIndex = history.length;
  try {
    commandExecute(parse(lex(command.toLowerCase())));
    print(command);
  } catch (e){
    print(e.message);
  }
  setCommand("");
}

module.exports = addListeners;
