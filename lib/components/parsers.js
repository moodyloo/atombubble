module.exports = function JSParser(Parser) {
  return class extends Parser {
    unexpected(code) {
      console.log(super.start);
      super.unexpected(code);
    }
  }
}