const PREC_BLOCK = -1
const PREC_TUPLE = -1
const PREC_EXP = 0
const PREC_OR = 2
const PREC_AND = 3
const PREC_EQUALITY = 5
const PREC_COMPARISON = 6
const PREC_TERM = 7
const PREC_FACTOR = 8
const PREC_UNARY = 9
const PREC_SEND = 11
const PREC_SPEC = 12
const PREC_OBJ = 13
const PREC_ASSIGNMENT = 14

module.exports = grammar({
  name: 'gab',

  word: $ => $.identifier,

  conflicts: $ => [[$._tuple]],

  extras: $ => [$.comment, /\s/, $._newline],

  rules: {
    source_file: $ => repeat($._statement),

    _identifiers: $ => repeat1(seq($.identifier, optional(','))),

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
        $.break,
        $.symbol,
        $.record,
        $.list,
        $.loop,
        $.block,
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
      seq('&', choice(
        $.message,
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

    _lhs: $ => prec(PREC_EXP + 1, seq(
      $._expression,
      optional('in'),
    )),

    binary: $ => (choice(
      prec(PREC_TERM, seq($._lhs, '+', $._expression)),
      prec(PREC_TERM, seq($._lhs, '-', $._expression)),
      prec(PREC_FACTOR, seq($._lhs, '*', $._expression)),
      prec(PREC_FACTOR, seq($._lhs, '/', $._expression)),
      prec(PREC_FACTOR, seq($._lhs, '%', $._expression)),
      prec(PREC_FACTOR, seq($._lhs, '^', $._expression)),
      prec(PREC_FACTOR, seq($._lhs, '&', $._expression)),
      prec(PREC_FACTOR, seq($._lhs, '|', $._expression)),
      prec(PREC_FACTOR, seq($._lhs, '<<', $._expression)),
      prec(PREC_FACTOR, seq($._lhs, '>>', $._expression)),
      prec(PREC_AND, seq($._lhs, 'and', $._expression)),
      prec(PREC_OR, seq($._lhs, 'or', $._expression)),
      prec(PREC_AND, seq($._lhs, 'then', $._newlines, $.body, 'end')),
      prec(PREC_OR, seq($._lhs, 'else', $._newlines, $.body, 'end')),
      prec(PREC_COMPARISON, seq($._lhs, '<', $._expression)),
      prec(PREC_COMPARISON, seq($._lhs, '>', $._expression)),
      prec(PREC_EQUALITY, seq($._lhs, '==', $._expression)),
      prec(PREC_EQUALITY, seq($._lhs, '<=', $._expression)),
      prec(PREC_EQUALITY, seq($._lhs, '>=', $._expression)),
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
          optional($.block),
        ),
      ),
    )),

    blkcall: $ => prec.right(PREC_SEND, seq(
      field('callee', $._expression),
      $.block,
    )),

    reccall: $ => prec.right(PREC_SEND, seq(
      field('callee', $._expression),
      $.record,
      optional($.block),
    )),

    symcall: $ => prec.right(PREC_SEND, seq(
      field('callee', $._expression),
      $.symbol,
      optional($.record),
      optional($.block),
    )),

    strcall: $ => prec.right(PREC_SEND, seq(
      field('callee', $._expression),
      $.string,
      optional($.record),
      optional($.block),
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
          optional($.block),
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

    break: $ => prec.right(seq(
      'break',
      optional($._expression),
    )),

    loop: $ => seq(
      'loop',
      $._newlines,
      optional($.body),
      optional(
        seq(
          'until',
          field('condition',
            $._expression,
          ),
        ),
      ),
      'end',
    ),

    case: $ => seq(
      $._expression,
      '=>',
      optional($.body),
      'end',
    ),

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
      field('name', $._identifiers),
      '=',
      field('value', $._tuple),
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

    stringcontent: _ => /[^\{\}\']*/,

    _interp: $ => seq(
      $.stringcontent,
      repeat(seq(
        '{',
        $._expression,
        '}',
        $.stringcontent,
      )),
    ),

    string: $ => choice(
      seq(
        '\'',
        $._interp,
        '\'',
      ),
      $._rawstring,
    ),

    rawstringcontent: _ => /[^\"]*/,

    _rawstring: $ => seq(
      '"',
      $.rawstringcontent,
      '"',
    ),

    comment: _ => token(
      seq(
        '#',
        /[^\n]*/,
        '\n',
      )
    ),

    identifier: _ => token(
      choice(
        seq(
          optional('*'),
          /[a-zA-Z_][a-zA-Z_\.]*[?!]?/,
        ),
        /@[0-9]*/,
      ),
    ),

    _newline: _ => token(/[\n;]/),

    _newlines: $ => repeat1($._newline),

    number: _ => token(/\d+(\.\d)?/),
  }
})
