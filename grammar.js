const PREC_UNARY = 2
const PREC_BINARY = 3
const PREC_APPLICATION = 4
const PREC_ASSIGNMENT = 1

const op_regex = /[\+\-\*\&\|\/\!\%\=\?><~$@\^]+/
const idn_regex = /[a-zA-Z_][a-zA-Z_\.]*[?!]?/

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
      ':',
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

    record_item: $ => prec(PREC_ASSIGNMENT + 1, seq(
      field('key', $._expression),
      ',',
      field('value', $._expression),
      choice(',', $._newline),
    )),

    _statement: $ => seq(
      $._expression,
      $._newlines,
    ),

    body: $ => seq(repeat($._statement), $._expression, optional($._newlines)),

    _expression: $ =>
      choice(
        $.sigil,
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

    unary: $ => prec(PREC_UNARY, seq(
      field('lhs', $._expression),
      field('message', choice($.message, $.operator)),
    )),

    binary: $ => prec.left(PREC_BINARY, seq(
      field('lhs', $._expression),
      optional('.'),
      field('message', choice($.message, $.operator)),
      field('rhs', $._expression),
    )),

    application: $ => prec.left(PREC_APPLICATION, seq(
      field('lhs', $._expression),
      optional('.'),
      field('rhs', $._expression),
    )),

    record: $ => seq(
      '{',
      repeat(
        seq(
          $.record_item,
        ),
      ),
      '}',
    ),

    list: $ => seq(
      '[',
      optional($._tuple),
      ']',
    ),

    assignment: $ => prec.right(PREC_ASSIGNMENT, seq(
      field('lhs', $._tuple),
      '::',
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

    sigil: _ => token(seq(
      '.',
      idn_regex,
    )),

    message: $ => token(seq(
      ':',
      field("name", choice(
        op_regex,
        idn_regex,
      )),
    )),

    message_literal: $ => token(seq(
      '\\',
      field("name", optional(choice(
        op_regex,
        idn_regex,
      ))),
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

    operator: _ => token(op_regex),

    identifier: _ => token(idn_regex),

    _newline: _ => token(/[\n;]/),

    _newlines: $ => repeat1($._newline),

    number: _ => token(/\d+(\.\d)?/),
  }
})
