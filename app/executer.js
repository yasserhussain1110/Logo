const turtle = require('./turtle');

function dispatch (command) {
  switch (command.type) {
    case "simple-no-arg":
      turtle.execute(command.name, []);
      break;
    case "simple-with-arg":
      turtle.execute(command.name, [command.arg]);
      break;
    case "repeat":
      turtle.repeating();
      for (let i=0; i<command.times; i++) {
        execute(command.subCommands);
      }
      turtle.switchOffRepeating();
  }
}

function execute(commands) {
  commands.forEach(dispatch);
}

module.exports = execute;
