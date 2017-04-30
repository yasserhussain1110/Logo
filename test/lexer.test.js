const expect = require('expect');
const lex = require('../app/lexer');

describe("Test lexer", ()=>{
  it("fd 40 should be lexed properly", ()=>{
    expect(lex("fd 40")).toEqual([
        {type: "keyword", value: "fd"},
        {type: "number", value: "40"}
      ]);
  });
});
