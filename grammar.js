
const PREC_EXP = 1
const PREC_ASSIGNMENT = 2
const PREC_OR = 3
const PREC_AND = 4
const PREC_EQUALITY = 5
const PREC_COMPARISON = 6
const PREC_TERM = 7
const PREC_FACTOR = 8
const PREC_UNARY = 9
const PREC_METHOD = 10
const PREC_PROPERTY = 11
const PREC_CALL = 12
const PREC_POST = 13

module.exports = grammar({
  name: 'gab',

  word: $ => $.identifier,

  rules: {
    source_file: $ => $.block_body,

    _expressions: $ => prec.right(seq(
      repeat(
        seq(
          $._expression, ',',
        ),
      ),
      $._expression,
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
      $.list_definition,
    ),

    _tuple: $ => seq(
      '(',
      optional($._expressions),
      ')',
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

    _object_kvp: $ => prec(3, seq(
      choice(
        field('key', $.identifier),
        $._definition,
        seq(
          field('key', $.identifier),
          ':',
          field('value', $._expression),
        ),
        seq(
          field('key', seq(
            '[',
            $._expression,
            ']'
          )),
          ':',
          field('value', $._expression),
        )
      ),
    )),

    block_body: $ => seq(
      repeat('\n'),
      repeat1(
        seq(
          $._expression,
          repeat1('\n'),
        )
      ),
    ),

    _expression: $ => prec(PREC_EXP, choice(
      $._definition,
      $.lambda,
      $.object,
      $.list,
      $.for,
      $.while,
      $.block,
      $.return,
      $.identifier,
      $.number,
      $.string,
      $.interpstring,
      $.bool,
      $.null,
      $.rawstring,
      $.call,
      $.obj_call,
      $.group,
      $.binary,
      $.unary,
      $.post,
      $.property,
      $.index,
      $.comment,
      $.assignment,
      $.let,
      $.method,
      $.global,
      $.match,
      $.if,
    )),

    global: $ => seq(field('bang', '!'), field('name', $.identifier)),

    unary: $ => prec(PREC_UNARY, choice(
      seq('-', $._expression),
      seq('not', $._expression),
      seq('..', $._expression),
    )),

    post: $ => prec(PREC_POST, choice(
      seq($._expression, '!'),
      seq($._expression, '?'),
    )),

    binary: $ => choice(
      prec.left(PREC_TERM, seq($._expression, '+', $._expression)),
      prec.left(PREC_TERM, seq($._expression, '-', $._expression)),
      prec.left(PREC_TERM, seq($._expression, '..', $._expression)),
      prec.left(PREC_FACTOR, seq($._expression, '*', $._expression)),
      prec.left(PREC_FACTOR, seq($._expression, '/', $._expression)),
      prec.left(PREC_FACTOR, seq($._expression, '%', $._expression)),
      prec.left(PREC_OR, seq($._expression, 'or', $._expression)),
      prec.left(PREC_AND, seq($._expression, 'and', $._expression)),
      prec.left(PREC_COMPARISON, seq($._expression, '<', $._expression)),
      prec.left(PREC_COMPARISON, seq($._expression, '>', $._expression)),
      prec.left(PREC_EQUALITY, seq($._expression, 'is', $._expression)),
      prec.left(PREC_EQUALITY, seq($._expression, '==', $._expression)),
      prec.left(PREC_EQUALITY, seq($._expression, '<=', $._expression)),
      prec.left(PREC_EQUALITY, seq($._expression, '>=', $._expression)),
    ),

    object: $ => seq(
      '{',
      repeat(
        seq($._object_kvp,
          optional(','),
          optional(repeat('\n')),
        )),
      '}',
    ),

    list: $ => seq(
      '[',
      repeat(
        seq(
          $._expression,
          optional(','),
          optional(repeat('\n')),
        )
      ),
      ']',
    ),

    lambda: $ => seq(
      '|',
      field('parameters', optional($._expressions)),
      '|',
      '=>',
      optional('\n'),
      field('body', $._expressions),
    ),

    return: $ => prec.left(seq(
      'return',
      optional($._expressions),
    )),

    obj_call: $ => prec(PREC_CALL, seq(
      field('receiver', $._expression),
      $.object,
    )),

    call: $ => prec(PREC_CALL, seq(
      field('receiver', $._expression),
      field('parameters', $._tuple),
    )),

    method: $ => prec.right(PREC_METHOD, seq(
      field('receiver', $._expression),
      ':',
      field('method', $._expression),
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

    let: $ => prec.right(PREC_ASSIGNMENT, seq(
      'let',
      field('left', $._identifiers),
      '=',
      field('right', $._expressions),
    )),

    assignment: $ => prec.right(PREC_ASSIGNMENT, seq(
      field('left', $._expression),
      '=',
      field('right', $._expression),
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
      optional('\n'),
      field('body', $._expression)
    ),

    while: $ => seq(
      'while',
      $._expression,
      optional('\n'),
      field('body', $._expression)
    ),

    if: $ => prec.left(seq(
      'if',
      '(',
      $._expression,
      ')',
      optional('\n'),
      $._expression,
      optional(seq(
        'else',
        optional('\n'),
        $._expression,
      )),
    )),

    _matchoption: $ => seq(
      $._expression,
      '=>',
      $._expression,
      '\n',
    ),

    match: $ => prec.right(seq(
      'match',
      $._expression,
      optional('\n'),
      field('case', repeat1($._matchoption)),
      '?',
      '=>',
      $._expression,
    )),

    block: $ => seq(
      'do',
      $.block_body,
      'end',
    ),

    function_definition: $ => seq(
      'def',
      field('name', $.identifier),
      field('parameters', $._tuple),
      optional('\n'),
      field('body', $._expression),
    ),

    object_definition: $ => seq(
      'def',
      field('name', $.identifier),
      field('body', $.object),
    ),

    list_definition: $ => seq(
      'def',
      field('name', $.identifier),
      field('body', $.list),
    ),

    bool: _ => choice('true', 'false'),

    null: _ => 'null',

    _interpstart: $ => token(seq(
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

    identifier: _ => token(/[a-zA-Z_]+/),
    number: _ => token(/\d+/)
  }
})
