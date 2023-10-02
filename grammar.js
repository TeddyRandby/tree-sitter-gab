const PREC_EXP = 1
const PREC_BLOCK = -1
const PREC_ASSIGNMENT = 2
const PREC_OR = 3
const PREC_AND = 4
const PREC_MATCH = 5
const PREC_EQUALITY = 6
const PREC_COMPARISON = 7
const PREC_TERM = 8
const PREC_FACTOR = 9
const PREC_UNARY = 10
const PREC_PROPERTY = 11
const PREC_METHOD = 12
const PREC_SPEC = 13
const PREC_OBJ = 14
const PREC_TUP = 15
const PREC_TAGSTR = 16

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

    _tuple: $ => prec(PREC_TUP, seq(
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

    _statement: $ => (seq(
      $._expression,
      optional(';'),
      optional($._newlines),
    )),

    _block_body: $ => seq(repeat1($._statement)),

    _expression: $ => prec.right(PREC_EXP, seq(choice(
      $._definition,
      $.symbol,
      $.record,
      $.list,
      $.for,
      $.loop,
      $.block,
      $.return,
      $.tagstring,
      $.identifier,
      $.number,
      $.string,
      $.bool,
      $.nil,
      $.property,
      $.rawstring,
      $.group,
      $.binary,
      $.unary,
      $.index,
      $.assignment,
      $.method,
      $.call,
      $.match,
      $.yield,
    ), optional('in'))),

    unary: $ => prec(PREC_UNARY, choice(
      seq('-', $._expression),
      seq('not', $._expression),
      seq('?', $._expression),
      seq('&', $.message),
    )),

    binary: $ => prec.right(choice(
      prec(PREC_TERM, seq($._expression, '+', $._expression)),
      prec(PREC_TERM, seq($._expression, '-', $._expression)),
      prec(PREC_TERM, seq($._expression, '..', $._expression)),
      prec(PREC_FACTOR, seq($._expression, '*', $._expression)),
      prec(PREC_FACTOR, seq($._expression, '/', $._expression)),
      prec(PREC_FACTOR, seq($._expression, '%', $._expression)),
      prec(PREC_FACTOR, seq($._expression, '&', $._expression)),
      prec(PREC_FACTOR, seq($._expression, '|', $._expression)),
      prec(PREC_FACTOR, seq($._expression, '<<', $._expression)),
      prec(PREC_FACTOR, seq($._expression, '>>', $._expression)),
      prec(PREC_AND, seq($._expression, 'and', $._expression)),
      prec(PREC_OR, seq($._expression, 'or', $._expression)),
      prec(PREC_AND, seq($._expression, 'then', $._block_body, 'end')),
      prec(PREC_OR, seq($._expression, 'else', $._block_body, 'end')),
      prec(PREC_COMPARISON, seq($._expression, '<', $._expression)),
      prec(PREC_COMPARISON, seq($._expression, '>', $._expression)),
      prec(PREC_EQUALITY, seq($._expression, 'is', $._expression)),
      prec(PREC_EQUALITY, seq($._expression, '==', $._expression)),
      prec(PREC_EQUALITY, seq($._expression, '<=', $._expression)),
      prec(PREC_EQUALITY, seq($._expression, '>=', $._expression)),
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

    method: $ => prec.right(PREC_METHOD, seq(
      optional(field('receiver', $._expression)),
      field('message', $.message),
      seq(
        optional(seq(
          '(',
          optional($._tuple),
          ')',
        )),
        optional($.record),
        optional($.block),
      ),
    )),

    call: $ => prec.right(PREC_METHOD, seq(
      field('callee', $._expression),
      choice(
        seq(
          '(',
          optional($._tuple),
          ')',
        ),

        $.record,

        $.block,

        seq(
          $.record,
          $.block,
        ),

        seq(
          '(',
          optional($._tuple),
          ')',
          $.record,
          $.block,
        ),
      ),
    )),

    property: $ => prec(PREC_PROPERTY, seq(
      field('receiver', $._expression),
      '.',
      field('property', $.identifier),
    )),

    index: $ => prec(PREC_PROPERTY, seq(
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
      field('body', $._block_body),
      'end',
    ),

    loop: $ => seq(
      'loop',
      field('body', $._block_body),
      optional(
        seq(
          'until',
          $._expression,
        ),
      ),
      'end',
    ),

    _matchoption: $ => seq(
      $._expression,
      '=>',
      $._block_body,
      'end',
    ),

    match: $ => prec(PREC_MATCH, seq(
      $._expression,
      'match',
      field('case', repeat($._matchoption)),
      'else',
      '=>',
      $._block_body,
      'end',
    )),

    block: $ => prec(PREC_BLOCK, seq(
      'do',
      optional($.parameters),
      $._newlines,
      field('body', ($._block_body)),
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
      field('body', $._block_body),
      'end',
    )),

    object_definition: $ => prec(PREC_OBJ, seq(
      'def',
      field('name', $.identifier),
      field('body', $.record),
    )),

    const_definition: $ => (seq(
      'def',
      field('name', $._identifiers),
      '=',
      field('value', $._tuple),
    )),

    bool: _ => choice('true', 'false'),

    nil: _ => 'nil',

    tagstring: $ => prec(PREC_TAGSTR, seq(
      field('tag', $.identifier),
      field('body', choice(
        $.string,
        $.rawstring,
      )),
    )),

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

    string: $ => seq(
      '\'',
      $._interp,
      '\'',
    ),

    rawstringcontent: _ => /[^\"]*/,

    rawstring: $ => seq(
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
