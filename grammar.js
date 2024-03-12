const PREC_BLOCK = -1
const PREC_TUPLE = -1
const PREC_EXP = 0
const PREC_UNARY = 3
const PREC_SEND = 2
const PREC_ASSIGNMENT = 1

module.exports = grammar({
  name: 'gab',

  word: $ => $.identifier,

  conflicts: $ => [[$._tuple]],

  extras: $ => [$.comment, /\s/, $._newline],

  rules: {
    source_file: $ => repeat($._statement),

    _identifiers: $ => repeat1(seq($.identifier, optional('[]'), optional(','))),

    parameters: $ => seq(
      optional($._identifiers),
      $._newlines,
    ),

    _tuple: $ => prec(PREC_TUPLE, seq(
      repeat(
        seq(
          prec(PREC_TUPLE, $._expression),
          ',',
        ),
      ),
      prec(PREC_TUPLE, $._expression),
    )),

    record_item: $ =>
      prec(PREC_EXP + 1, seq(
        field('key',
          choice(
            $.identifier,
            $.symbol,
            $.string,
            seq(
              '[',
              $._expression,
              ']'
            ),
          ),
        ),
        optional(seq(
          '=',
          field('value', $._expression),
        )),
        optional(','),
      )),

    _statement: $ => seq(
      $._expression,
      $._newlines,
    ),

    body: $ => seq(repeat($._statement), $._expression, optional($._newlines)),

    _expression: $ => prec.right(PREC_EXP,
      choice(
        $.symbol,
        $.record,
        $.list,
        $.block,
        $.identifier,
        $.number,
        $.string,
        $.tuple_exp,
        $.binary,
        $.unary,
        $.assignment,
        $.dynsend,
        $.message_literal,
        seq($.identifier, '[]'),
      ),
    ),

    unary: $ => prec(PREC_UNARY, seq(
      $._expression,
      choice($.operator, $.message),
    )),

    binary: $ => prec.left(PREC_SEND, seq(
      field('lhs', $._expression),
      field('message', choice($.operator, $.message)),
      field('rhs', $._expression),
    )),

    record: $ => seq(
      '{',
      repeat($.record_item),
      '}',
    ),

    list: $ => seq(
      '[',
      $._tuple,
      ']',
    ),

    dynsend: $ => prec.right(PREC_SEND, seq(
      field('lhs', $._expression),
      ':',
      '{',
      field('message', $._expression),
      '}',
      field('rhs', $._expression),
    )),

    assignment: $ => prec.right(PREC_ASSIGNMENT, seq(
      field('left', $._tuple),
      '=',
      field('right', $._tuple),
    )),

    tuple_exp: $ => seq(
      '(',
      $._tuple,
      ')',
    ),

    block: $ => prec(PREC_BLOCK, seq(
      'do',
      $.parameters,
      $.body,
      'end',
    )),

    symbol: _ => token(seq(
      '.',
      /[a-zA-Z_][a-zA-Z_\.]*[?!]?/,
    )),

    message: $ => seq(
      ':',
      field('name', $.identifier),
    ),

    message_literal: $ => seq(
      '\\',
      field('name', choice($.identifier, $.operator))
    ),

    interpbegin: _ => token(seq(
      '\'',
      /[^\{\']*/,
      '{',
    )),

    interpmiddle: _ => token(seq(
      '}',
      /[^\{\']*/,
      '{',
    )),

    interpend: _ => token(seq(
      '}',
      /[^\'\{]*/,
      '\'',
    )),

    singlestring: _ => token(seq(
      '\'',
      /[^\'\{]*/,
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
      seq(
        $.interpbegin,
        $._expression,
        repeat(seq($.interpmiddle, $._expression)),
        $.interpend,
      ),
    ),

    comment: _ => token(seq('#', /.*/)),

    operator: _ => token(
      choice(
        /[\+\-\*\&\|\/\!\%\=\?><~$@\^]+/,
      ),
    ),

    identifier: _ => token(
      /[a-zA-Z_][a-zA-Z_\.]*[?!]?/,
    ),

    _newline: _ => token(/[\n;]/),

    _newlines: $ => repeat1($._newline),

    number: _ => token(/\d+(\.\d)?/),
  }
})
