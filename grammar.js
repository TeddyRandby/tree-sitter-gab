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

  conflicts: $ => [[$.tuple]],

  rules: {
    source_file: $ => $._block_body,

    tuple: $ => prec.left(seq(
      repeat(
        seq(
          $._expression,
          ',',
          optional(repeat('\n')),
        ),
      ),
      $._expression,
    )),

    parameters: $ => prec(PREC_SPEC, seq(
      repeat(
        seq(
          $.identifier, ',',
        ),
      ),
      choice(
        $.identifier,
        seq(
          "..",
          $.identifier,
        ),
      ),
    )),

    _identifiers: $ => prec.right(seq(
      repeat(
        seq(
          $.identifier, ',',
        )
      ),
      $.identifier
    )),

    _definition: $ => choice(
      $.function_definition,
      $.object_definition,
      $.const_definition,
    ),

    _ids: $ => seq(
      repeat(
        seq(
          choice(
            $.identifier,
          ),
          ',',
        ),
      ),
      $.identifier,
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

    _block_body: $ => seq(
      repeat('\n'),
      repeat1(
        seq(
          $._expression,
          optional(';'),
          optional($.comment),
          repeat('\n'),
        )
      ),
    ),

    impl: $ => seq(
      'impl',
      field("name", $._expression),
      $._block_body,
      'end',
    ),

    _expression: $ => prec(PREC_EXP, choice(
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
      $.empty_method,
      $.call,
      $.match,
      $.comment,
      $.yield,
      $.impl,
    )),

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
          optional(repeat('\n')),
        )),
      '}',
    ),

    list: $ => seq(
      '[',
      $.tuple,
      ']',
    ),

    yield: $ => prec.left(seq(
      'yield',
      optional($.tuple),
    )),

    return: $ => prec.left(seq(
      'return',
      optional($.tuple),
    )),

    empty_method: $ => prec.left(PREC_EXP,
      field('message', $.message),
    ),

    method: $ => prec.left(PREC_METHOD, seq(
      field('receiver', $._expression),
      field('message', $.message),
      seq(
        optional(seq(
          '(',
          optional($.tuple),
          ')',
        )),
        optional($.record),
        optional($.block),
      ),
    )),

    call: $ => prec.left(PREC_METHOD, seq(
      field('callee', $._expression),
      seq(
        seq(
          '(',
          optional($.tuple),
          ')',
        ),
        optional($.record),
        optional($.block),
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
      field('left', $.tuple),
      '=',
      field('right', $.tuple),
    )),

    group: $ => seq(
      '(',
      $._expression,
      ')',
    ),

    for: $ => seq(
      'for',
      field('names', $._ids),
      'in',
      $._expression,
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
      field('case', repeat1($._matchoption)),
      'else',
      '=>',
      $._block_body,
      'end',
    )),

    block: $ => seq(
      'do',
      optional(
        seq(
          '(',
          optional($.parameters),
          ')',
        ),
      ),
      $._block_body,
      'end',
    ),

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
      field('parameters',
        optional(
          seq(
            '(',
            optional($.parameters),
            ')',
          ),
        ),
      ),
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
      field('value', $.tuple),
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
      '$',
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

    identifier: _ => token(/[a-zA-Z_]+[?!]?/),

    number: _ => token(/\d+/),

  }
})
