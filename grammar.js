const PREC_BLOCK = -1
const PREC_TUPLE = -1
const PREC_EXP = 0
const PREC_UNARY = 3
const PREC_SEND = 2
const PREC_SPEC = 4
const PREC_OBJ = 5
const PREC_ASSIGNMENT = 6

module.exports = grammar({
  name: 'gab',

  word: $ => $.identifier,

  conflicts: $ => [[$._tuple]],

  extras: $ => [$.comment, /\s/, $._newline],

  rules: {
    source_file: $ => repeat($._statement),

    _identifiers: $ => repeat1(seq(optional('..'), $.identifier, optional(','))),

    parameters: $ => (seq(
      '(',
      optional($._identifiers),
      ')',
    )),

    _tuple: $ => prec(PREC_TUPLE, seq(
      repeat(
        seq(
          prec(PREC_TUPLE, $._expression),
          ',',
        ),
      ),
      prec(PREC_TUPLE, $._expression),
      optional(','),
    )),

    _definition: $ => choice(
      $.function_definition,
      $.object_definition,
      $.const_definition,
    ),

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

    body: $ => choice(
      seq(repeat($._statement), $._expression),
      repeat1($._statement),
    ),

    _expression: $ => prec.right(PREC_EXP,
      choice(
        $._definition,
        $.symbol,
        $.record,
        $.list,
        $.block,
        $.lambda,
        $.return,
        $.identifier,
        $.number,
        $.string,
        $.bool,
        $.nil,
        $.group,
        $.binary,
        $.unary,
        $.index,
        $.assignment,
        $.send,
        $.dynsend,
        $.symcall,
        $.strcall,
        $.reccall,
        $.blkcall,
        $.call,
        $.yield,
      ),
    ),

    unary: $ => prec(PREC_UNARY, choice(
      seq('-', $._expression),
      seq('not', $._expression),
      seq('?', $._expression),
      seq('..', $._expression),
      seq('&', choice(
        $.message,
        '..',
        '[]',
        '[=]',
        '()',
        '<<',
        '>>',
        '|',
        '&',
        '==',
        '<=',
        '>=',
        '<',
        '>',
        '+',
        '-',
        '*',
        '/',
        '%',
      )),
    )),

    binary: $ => prec.left(PREC_SEND, choice(
      seq($._expression, '+', $._expression),
      seq($._expression, '-', $._expression),
      seq($._expression, '*', $._expression),
      seq($._expression, '/', $._expression),
      seq($._expression, '%', $._expression),
      seq($._expression, '^', $._expression),
      seq($._expression, '&', $._expression),
      seq($._expression, '|', $._expression),
      seq($._expression, '<<', $._expression),
      seq($._expression, '>>', $._expression),
      seq($._expression, '<', $._expression),
      seq($._expression, '>', $._expression),
      seq($._expression, '==', $._expression),
      seq($._expression, '<=', $._expression),
      seq($._expression, '>=', $._expression),
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

    yield: $ => prec.right(seq(
      'yield',
      optional($._tuple),
    )),

    return: $ => prec.right(seq(
      'return',
      field('value', optional($._tuple)),
    )),

    dynsend: $ => prec.right(PREC_SEND, seq(
      field('receiver', $._expression),
      ':',
      '(',
      field('message', $._expression),
      ')',
      field('argument',
        seq(
          optional(seq(
            '(',
            optional($._tuple),
            ')',
          )),
          optional($.string),
          optional($.record),
          optional($.block),
        ),
      ),
    )),


    send: $ => prec.right(PREC_SEND, seq(
      optional(field('receiver', $._expression)),
      field('message', $.message),
      field('argument',
        seq(
          optional(seq(
            '(',
            optional($._tuple),
            ')',
          )),
          optional($.string),
          optional($.record),
          optional(choice($.block, $.lambda)),
        ),
      ),
    )),

    blkcall: $ => prec.right(PREC_SEND, seq(
      field('callee', $._expression),
      field('argument', choice($.block, $.lambda)),
    )),

    reccall: $ => prec.right(PREC_SEND, seq(
      field('callee', $._expression),
      field('argument',
        seq(
          $.record,
          optional(choice($.block, $.lambda)),
        ),
      ),
    )),

    symcall: $ => prec.right(PREC_SEND, seq(
      field('callee', $._expression),
      field('argument',
        seq(
          $.symbol,
          optional($.record),
          optional(choice($.block, $.lambda)),
        ),
      ),
    )),

    strcall: $ => prec.right(PREC_SEND, seq(
      field('callee', $._expression),
      field('argument',
        seq(
          $.string,
          optional($.record),
          optional(choice($.block, $.lambda)),
        ),
      ),
    )),

    call: $ => prec.right(PREC_SEND, seq(
      field('callee', $._expression),
      field('argument',
        seq(
          '(',
          optional($._tuple),
          ')',
          optional($.string),
          optional($.record),
          optional(choice($.block, $.lambda)),
        ),
      ),
    )),

    index: $ => prec(PREC_SEND, seq(
      field('receiver', $._expression),
      '[',
      field('property', $._expression),
      ']'
    )),

    assignment: $ => prec.right(PREC_ASSIGNMENT, seq(
      field('left', $._tuple),
      '=',
      field('right', $._tuple),
    )),

    group: $ => seq(
      '(',
      $._expression,
      ')',
    ),

    case: $ => seq(
      $._expression,
      '=>',
      optional($.body),
      'end',
    ),

    lambda: $ => prec(PREC_EXP, seq(
      '=>',
      $._expression,
    )),

    block: $ => prec(PREC_BLOCK, seq(
      'do',
      optional($.parameters),
      $._newlines,
      optional($.body),
      'end',
    )),

    function_definition: $ => prec(PREC_SPEC, seq(
      'def',
      field('name', choice(
        $.identifier,
        '..',
        '+',
        '-',
        '*',
        '/',
        '<',
        '<<',
        '>',
        '>>',
        '==',
        '[]',
        '[=]',
        '()',
        seq(
          '(',
          $._expression,
          ')',
        ),
      )),
      optional(
        field('type',
          seq(
            '[',
            optional($._expression),
            ']',
          ),
        ),
      ),
      optional($.parameters),
      $._newlines,
      $.body,
      'end',
    )),

    object_definition: $ => prec(PREC_OBJ, seq(
      'def',
      field('name', $.identifier),
      field('value', $.record),
    )),

    const_definition: $ => (seq(
      'def',
      field('name', $.identifier),
    )),

    bool: _ => choice('true', 'false'),

    nil: _ => 'nil',

    symbol: _ => token(seq(
      '.',
      /[a-zA-Z_][a-zA-Z_\.]*[?!]?/,
    )),

    message: $ => seq(
      ':',
      field('name', $.identifier),
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

    identifier: _ => token(
      choice(
        /[a-zA-Z_][a-zA-Z_\.]*[?!]?/,
        /@[0-9]*/,
      ),
    ),

    _newline: _ => token(/[\n;]/),

    _newlines: $ => repeat1($._newline),

    number: _ => token(/\d+(\.\d)?/),
  }
})
