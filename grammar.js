const PREC_BLOCK = -1
const PREC_EXP = 0
const PREC_TUP = 1
const PREC_OR = 2
const PREC_AND = 3
const PREC_MATCH = 4
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
    source_file: $ => $._block_body,

    _identifiers: $ => repeat1(seq($.identifier, optional(','))),

    parameters: $ => (seq(
      '(',
      optional($._identifiers),
      ')',
    )),

    _tuple: $ => prec.right(PREC_TUP, seq(
      repeat(
        prec(PREC_TUP, seq(
          $._expression,
          ',',
          optional($._newlines),
        ),
        ),
      ),
      $._expression,
    )),

    _definition: $ => choice(
      $.function_definition,
      $.object_definition,
      $.const_definition,
    ),

    _record_kvp: $ => (seq(
      choice(
        field('key', $.identifier),
        field('key', seq(
          '[',
          $._expression,
          ']'
        )),
        seq(
          field('key', $.identifier),
          '=',
          field('value', $._expression),
        ),
        seq(
          field('key', seq(
            '[',
            $._expression,
            ']'
          )),
          '=',
          field('value', $._expression),
        )
      ),
    )),

    _statement: $ => seq(
      $._expression,
      $._newline,
    ),

    _block_body: $ => repeat1($._statement),

    _expression: $ => prec.right(PREC_EXP,
      choice(
        $._definition,
        $.symbol,
        $.record,
        $.list,
        $.for,
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
        $.call,
        $.match,
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

    _lhs: $ => prec(PREC_EXP, seq(
      $._expression,
      optional('in'),
    )),

    binary: $ => (choice(
      prec(PREC_TERM, seq($._lhs, '+', $._expression)),
      prec(PREC_TERM, seq($._lhs, '-', $._expression)),
      prec(PREC_FACTOR, seq($._lhs, '*', $._expression)),
      prec(PREC_FACTOR, seq($._lhs, '/', $._expression)),
      prec(PREC_FACTOR, seq($._lhs, '%', $._expression)),
      prec(PREC_FACTOR, seq($._lhs, '&', $._expression)),
      prec(PREC_FACTOR, seq($._lhs, '|', $._expression)),
      prec(PREC_FACTOR, seq($._lhs, '<<', $._expression)),
      prec(PREC_FACTOR, seq($._lhs, '>>', $._expression)),
      prec(PREC_AND, seq($._lhs, 'and', $._expression)),
      prec(PREC_OR, seq($._lhs, 'or', $._expression)),
      prec(PREC_AND, seq($._lhs, 'then', $._block_body, 'end')),
      prec(PREC_OR, seq($._lhs, 'else', $._block_body, 'end')),
      prec(PREC_COMPARISON, seq($._lhs, '<', $._expression)),
      prec(PREC_COMPARISON, seq($._lhs, '>', $._expression)),
      prec(PREC_EQUALITY, seq($._lhs, '==', $._expression)),
      prec(PREC_EQUALITY, seq($._lhs, '<=', $._expression)),
      prec(PREC_EQUALITY, seq($._lhs, '>=', $._expression)),
    )),

    record: $ => seq(
      '{',
      repeat(
        seq($._record_kvp,
          optional(','),
          optional($._newlines),
        )),
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
      optional($._tuple),
    )),

    send: $ => prec.right(PREC_SEND, seq(
      optional(field('receiver', $._expression)),
      field('message', $.message),
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
    )),

    call: $ => prec.right(PREC_SEND, seq(
      field('callee', $._expression),
      choice(
        seq(
          '(',
          optional($._tuple),
          ')',
        ),

        $.string,

        $.record,

        $.block,

        seq(
          seq(
            '(',
            optional($._tuple),
            ')',
          ),
          $.string,
        ),

        seq(
          seq(
            '(',
            optional($._tuple),
            ')',
          ),
          $.record,
        ),

        seq(
          seq(
            '(',
            optional($._tuple),
            ')',
          ),
          $.block,
        ),

        seq(
          $.string,
          $.record,
        ),

        seq(
          $.string,
          $.block,
        ),

        seq(
          $.record,
          $.block,
        ),

        seq(
          seq(
            '(',
            optional($._tuple),
            ')',
          ),
          $.string,
          $.record,
        ),

        seq(
          seq(
            '(',
            optional($._tuple),
            ')',
          ),
          $.string,
          $.block,
        ),

        seq(
          seq(
            '(',
            optional($._tuple),
            ')',
          ),
          $.record,
          $.block,
        ),

        seq(
          $.string,
          $.record,
          $.block,
        ),

        seq(
          seq(
            '(',
            optional($._tuple),
            ')',
          ),
          $.string,
          $.record,
          $.block,
        ),
      ),
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

    for: $ => seq(
      'for',
      field('names', $._identifiers),
      'in',
      $._expression,
      $._newlines,
      $._block_body,
      'end',
    ),

    loop: $ => seq(
      'loop',
      $._block_body,
      optional(
        seq(
          'until',
          $._expression,
        ),
      ),
      'end',
    ),

    case: $ => seq(
      $._expression,
      '=>',
      $._block_body,
      'end',
    ),

    match: $ => prec(PREC_MATCH, seq(
      $._lhs,
      'match',
      $._newlines,
      repeat($.case),
      'else',
      '=>',
      $._block_body,
      'end',
    )),

    block: $ => prec(PREC_BLOCK, seq(
      'do',
      optional($.parameters),
      $._newlines,
      $._block_body,
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
      $._block_body,
      'end',
    )),

    object_definition: $ => prec(PREC_OBJ, seq(
      'def',
      field('name', $.identifier),
      $.record,
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
      /[_a-zA-Z]*/,
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
          optional('..'),
          /[a-zA-Z_]+[?!]?/,
        ),
        /@[0-9]*/,
      ),
    ),

    _newline: _ => token(/[\n;]/),

    _newlines: $ => repeat1($._newline),

    number: _ => token(/\d+/),
  }
})
