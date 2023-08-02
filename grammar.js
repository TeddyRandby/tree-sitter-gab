const PREC_EXP = 1
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

module.exports = grammar({
  name: 'gab',

  word: $ => $.identifier,

  conflicts: $ => [[$._tuple]],

  rules: {
    source_file: $ => $._block_body,

    _identifiers: $ => seq(
      repeat(seq($.identifier, ',')),
      $.identifier
    ),

    parameters: $ => prec.left(
      seq(
        '(',
        $._identifiers,
        ')',
      ),
    ),

    _tuple: $ => prec.left(seq(
      repeat(
        seq(
          $._expression,
          ',',
          optional($._newlines),
        ),
      ),
      $._expression,
    )),

    _definition: $ => choice(
      $.function_definition,
      $.object_definition,
      $.const_definition,
    ),

    _record_kvp: $ => prec(3, seq(
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

    _statement: $ => prec.left(seq(
      $._expression,
      optional(';'),
      optional($.comment),
      optional($._newlines),
    )),

    _newlines: _ => repeat1('\n'),

    _block_body: $ => seq(repeat1($._statement)),

    impl: $ => seq(
      'impl',
      field("name", $._expression),
      $._newlines,
      $._block_body,
      'end',
    ),

    _expression: $ => prec.left(PREC_EXP, seq(choice(
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
      $.interpstring,
      $.bool,
      $.nil,
      $.property,
      $.rawstring,
      $.group,
      $.binary,
      $.unary,
      $.index,
      $.comment,
      $.assignment,
      $.method,
      $.call,
      $.match,
      $.comment,
      $.yield,
      $.impl,
    ), optional('!'))),

    unary: $ => prec(PREC_UNARY, choice(
      seq('-', $._expression),
      seq('not', $._expression),
      seq('?', $._expression),
      seq('&', $.message),
    )),

    binary: $ => choice(
      prec.left(PREC_TERM, seq($._expression, '+', $._expression)),
      prec.left(PREC_TERM, seq($._expression, '-', $._expression)),
      prec.left(PREC_TERM, seq($._expression, '..', $._expression)),
      prec.left(PREC_FACTOR, seq($._expression, '*', $._expression)),
      prec.left(PREC_FACTOR, seq($._expression, '/', $._expression)),
      prec.left(PREC_FACTOR, seq($._expression, '%', $._expression)),
      prec.left(PREC_FACTOR, seq($._expression, '&', $._expression)),
      prec.left(PREC_FACTOR, seq($._expression, '|', $._expression)),
      prec.left(PREC_FACTOR, seq($._expression, '<<', $._expression)),
      prec.left(PREC_FACTOR, seq($._expression, '>>', $._expression)),
      prec.left(PREC_AND, seq($._expression, 'and', $._expression)),
      prec.left(PREC_OR, seq($._expression, 'or', $._expression)),
      prec.left(PREC_AND, seq($._expression, 'then', $._block_body, 'end')),
      prec.left(PREC_OR, seq($._expression, 'else', $._block_body, 'end')),
      prec.left(PREC_COMPARISON, seq($._expression, '<', $._expression)),
      prec.left(PREC_COMPARISON, seq($._expression, '>', $._expression)),
      prec.left(PREC_EQUALITY, seq($._expression, 'is', $._expression)),
      prec.left(PREC_EQUALITY, seq($._expression, '==', $._expression)),
      prec.left(PREC_EQUALITY, seq($._expression, '<=', $._expression)),
      prec.left(PREC_EQUALITY, seq($._expression, '>=', $._expression)),
    ),

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

    yield: $ => prec.left(seq(
      'yield',
      optional($._tuple),
    )),

    return: $ => prec.left(seq(
      'return',
      optional($._tuple),
    )),

    method: $ => prec.left(PREC_METHOD, seq(
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

    call: $ => prec.left(PREC_METHOD, seq(
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

    match: $ => prec.right(PREC_MATCH, seq(
      $._expression,
      'match',
      field('case', repeat($._matchoption)),
      'else',
      '=>',
      $._block_body,
      'end',
    )),

    block: $ => prec(PREC_SPEC, seq(
      'do',
      optional($.parameters),
      $._newlines,
      field('body', $._block_body),
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

    const_definition: $ => prec.left(seq(
      'def',
      field('name', $._identifiers),
      '=',
      field('value', $._tuple),
    )),

    bool: _ => choice('true', 'false'),

    nil: _ => 'nil',

    _interpstart: _ => token(seq(
      '\'',
      /[^\{\']*/,
      '{',
    )),

    _interpmiddle: $ => seq(
      $._expression,
      token(seq(
        '}',
        /[^\{\']*/,
        '{'
      ))
    ),

    _interpend: _ => token(seq(
      '}',
      /[^\'\{]*/,
      '\'',
    )),

    interpstring: $ => seq(
      $._interpstart,
      repeat($._interpmiddle),
      $._expression,
      $._interpend,
    ),

    string: _ => seq(
      '\'',
      /[^\']*/,
      '\'',
    ),

    symbol: _ => token(seq(
      '.',
      /[_a-zA-Z]*/,
    )),

    message: $ => seq(
      ':',
      field('name', $.identifier),
    ),

    rawstring: _ => token(seq(
      '"',
      /[^\"]*/,
      '"',
    )),

    comment: _ => token(
      seq(
        '#',
        /[^\n]*/,
        '\n'
      )
    ),

    identifier: _ => token(seq(
      optional('..'),
      /[a-zA-Z_]+[?!]?/,
    )),

    number: _ => token(/\d+/),

  }
})
