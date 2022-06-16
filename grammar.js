
const PREC_EXP = 1
const PREC_ASSIGNMENT = 2
const PREC_OR = 3
const PREC_AND = 4
const PREC_EQUALITY = 5
const PREC_COMPARISON = 6
const PREC_BITWISE_OR = 7
const PREC_BITWISE_AND = 8
const PREC_TERM = 9
const PREC_FACTOR = 10
const PREC_UNARY = 11
const PREC_CALL = 12
const PREC_PROPERTY = 13

module.exports = grammar({
  name: 'gab',

  rules: {
    source_file: $ => $._block_body,

    _expressions: $ => prec.right(seq(
      repeat(
        seq(
          $._expression,
          ',',
        ),
      ),
      $._expression,
    )),

    _tuple: $ => seq(
      '(',
      optional($._expressions),
      ')',
    ),

    _ids: $ => prec.right(seq(
      repeat(
        seq(
          $.identifier,
          ',',
        ),
      ),
      $.identifier,
    )),

    _object_kvp: $ => prec(3, seq(
      choice(
        field('key', $.identifier),
        seq(
          field('key', $.identifier),
          '=',
          field('value', $._expression),
        ),
      ),
    )),

    _block_body: $ => seq(
      repeat('\n'),
      repeat1(
        seq(
          $._expression,
          repeat1('\n'),
        )
      ),
    ),

    _expression: $ => prec(PREC_EXP, choice(
      $.function_definition,
      $.object_definition,
      $.list_definition,
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
      $.bool,
      $.null,
      $.rawstring,
      $.call,
      $.obj_call,
      $.group,
      $.binary,
      $.unary,
      $.property,
      $.index,
      $.comment,
      $.assignment,
      $.method,
      $.global,
    )),

    global: $ => seq('!', field('name', $.identifier)),

    unary: $ => prec(PREC_UNARY, choice(
      seq('-', $._expression),
      seq('not', $._expression),
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
      prec.left(PREC_BITWISE_OR, seq($._expression, '|', $._expression)),
      prec.left(PREC_BITWISE_AND, seq($._expression, '&', $._expression)),
      prec.left(PREC_COMPARISON, seq($._expression, '<', $._expression)),
      prec.left(PREC_COMPARISON, seq($._expression, '>', $._expression)),
      prec.left(PREC_EQUALITY, seq($._expression, '==', $._expression)),
      prec.left(PREC_EQUALITY, seq($._expression, '<=', $._expression)),
      prec.left(PREC_EQUALITY, seq($._expression, '>=', $._expression)),
    ),

    object: $ => seq(
      '{',
      repeat($._object_kvp),
      '}',
    ),

    list: $ => seq(
      '[',
      repeat(
        seq(
          $._expression,
          optional('\n'),
        )
      ),
      ']',
    ),

    lambda: $ => seq(
      '|',
      field('parameters', optional($._expressions)),
      '|:',
      optional('\n'),
      field('body', $._expression),
    ),

    return: $ => seq(
      'return',
      $._tuple,
    ),

    obj_call: $ => prec(PREC_CALL, seq(
      field('receiver', $._expression),
      $.object,
    )),

    call: $ => prec(PREC_CALL, seq(
      field('receiver', $._expression),
      field('parameters', $._tuple),
    )),

    method: $ => prec(PREC_PROPERTY, seq(
      field('receiver', $._expression),
      '->',
      field('name', choice(
        $.global,
        $.identifier
      )),
      field('parameters', $._tuple),
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

    assignment: $ => prec(PREC_ASSIGNMENT, seq(
      field('left', $._ids),
      '=',
      field('right', $._expressions),
    )),

    group: $ => seq(
      '(',
      $._expression,
      ')',
    ),

    for: $ => seq(
      'for',
      $._ids,
      'in',
      $._expression,
      ':',
      field('body', $._expression)
    ),

    while: $ => seq(
      'while',
      $._expression,
      ':',
      field('body', $._expression)
    ),

    block: $ => seq(
      'do',
      $._block_body,
      'end',
    ),

    function_definition: $ => seq(
      'def',
      field('name', $.identifier),
      field('parameters', $._tuple),
      ':',
      optional('\n'),
      field('body', $._expression),
    ),

    object_definition: $ => seq(
      'def',
      field('name', $.identifier),
      ':',
      field('body', $.object),
    ),

    list_definition: $ => seq(
      'def',
      field('name', $.identifier),
      ':',
      field('body', $.list),
    ),

    bool: $ => choice('true', 'false'),

    null: $ => 'null',

    string: $ => seq(
      '\'',
      /[^\']*/,
      '\'',
    ),

    rawstring: $ => seq(
      '"',
      /[^\"]*/,
      '"',
    ),

    comment: $ => token(
      seq(
        '#',
        /[^\n]*/,
        '\n'
      )
    ),

    identifier: $ => /[a-z_]+/,
    number: $ => /\d+/
  }
})
