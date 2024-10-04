const PREC_UNARY = 2
const PREC_BINARY = 3
const PREC_SEND = 4
const PREC_SPECIAL_SEND = 5

const op_regex = /[\+\-\*\&\|\/\!\%\=\?><~$@\^]+/
const sym_regex = /[a-zA-Z_][a-zA-Z_\.]*[?!]?/

module.exports = grammar({
  name: 'gab',

  word: $ => $.symbol,

  extras: $ => [$.comment, /\s/, $._newline],

  rules: {
    source_file: $ => repeat($._expression),

    body: $ => seq(repeat1($._expression)),

    _expression: $ =>
      choice(
        $.sigil,
        $.record,
        $.list,
        $.block,
        $.symbol,
        $.number,
        $.string,
        $.tuple,
        $.binary,
        $.unary,
        $.message,
        $.special_send,
      ),

    unary: $ => prec(PREC_UNARY, seq(
      field('lhs', $._expression),
      field('message', choice($.send, $.operator)),
    )),

    binary: $ => prec.left(PREC_BINARY, seq(
      field('lhs', $._expression),
      field('message', choice($.send, $.operator)),
      field('rhs', $._expression),
    )),

    special_send: $ => prec.left(PREC_SPECIAL_SEND, seq(
      field('lhs', $._expression),
      field('message', choice('=>', '=')),
      field('rhs', $._expression),
    )),

    record: $ => seq(
      '{',
      repeat(
        seq(
          $._expression,
          $._expression,
        ),
      ),
      '}',
    ),

    tuple: $ => seq(
      '(',
      repeat($._expression),
      ')',
    ),

    list: $ => seq(
      '[',
      repeat($._expression),
      ']',
    ),

    block: $ => seq(
      'do',
      repeat($._expression),
      'end',
    ),

    sigil: _ => token(seq(
      '.',
      sym_regex,
    )),

    send: _ => token(seq(
      ':',
      field("name", choice(
        op_regex,
        sym_regex,
      )),
    )),

    message: _ => token(seq(
      '\\',
      field("name", optional(choice(
        op_regex,
        sym_regex,
      ))),
    )),

    singlestring: _ => token(seq(
      '\'',
      /[^\']*/,
      '\'',
    )),

    doublestring: _ => token(seq(
      '"',
      /[^\"]*/,
      '"',
    )),

    string: $ => choice(
      $.singlestring,
      $.doublestring,
    ),

    comment: _ => token(seq('#', /.*/)),

    operator: _ => token(op_regex),

    symbol: _ => token(sym_regex),

    _newline: _ => token(/[\n;,]/),

    number: _ => token(/\d+(\.\d)?/),
  }
})
