const PREC_UNARY = 2
const PREC_BINARY = 3
const PREC_APPLICATION = 4
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

    _tuple: $ => seq(
      repeat(
        seq(
          $._expression,
          ',',
        ),
      ),
      $._expression,
      optional(','),
    ),

    record_item: $ =>
      prec(PREC_ASSIGNMENT + 1, seq(
        field('key',
          choice(
            $.identifier,
            $.symbol,
            $.string,
            $.message_literal,
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
      )),

    _statement: $ => seq(
      $._expression,
      $._newlines,
    ),

    body: $ => seq(repeat($._statement), $._expression, optional($._newlines)),

    _expression: $ => prec.right(
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
        $.application,
        $.unary,
        $.assignment,
        $.message_literal,
        seq($.identifier, '[]'),
      ),
    ),

    unary: $ => prec(PREC_UNARY, seq(
      $._expression,
      choice($.operator, $.message),
    )),

    binary: $ => prec.left(PREC_BINARY, seq(
      field('lhs', $._expression),
      field('message', choice($.operator, $.message)),
      field('rhs', $._expression),
    )),

    application: $ => prec.left(PREC_APPLICATION, seq(
      $._expression,
      $._expression,
    )),

    record: $ => seq(
      '{',
      repeat(
        seq(
          $.record_item,
          ',',
        ),
      ),
      $.record_item,
      optional(','),
      '}',
    ),

    list: $ => seq(
      '[',
      $._tuple,
      ']',
    ),

    assignment: $ => prec.right(PREC_ASSIGNMENT, seq(
      field('lhs', $._tuple),
      '=',
      field('rhs', $._tuple),
    )),

    tuple_exp: $ => seq(
      '(',
      optional($._tuple),
      ')',
    ),

    block: $ => seq(
      'do',
      $.parameters,
      $.body,
      'end',
    ),

    symbol: _ => token(seq(
      '.',
      /[a-zA-Z_][a-zA-Z_\.]*[?!]?/,
    )),

    message: $ => seq(
      ':',
      field('name', choice($.identifier, $.operator)),
      optional(/[?!]?/),
    ),

    message_literal: $ => prec.right(seq(
      '\\',
      optional(
        field('name',
          choice($.identifier, $.operator),
        )),
    )),

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
