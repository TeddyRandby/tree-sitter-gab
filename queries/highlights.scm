; Highlights.scm for gab
(comment) @comment

(number) @number

(identifier) @variable

(symbol) @string.special

(message_literal) @constant
(message_literal name: (identifier) @constant)
(message_literal name: (operator) @constant)

[
 (bool)
 (nil)
] @boolean

[
  (string)
] @string

[
  ","
] @punctuation.delimiter

[
  "do"
  "end"
] @keyword

[
  "{"
  "}"
  "["
  "]"
  "("
  ")"
] @punctuation.bracket

[
 (call lhs: (identifier))
] @method.call

(operator) @operator

(message) @method.call
(message name: (identifier) @method.call)

(parameters (identifier) @parameter)

(record_item key: (identifier) @field)

((identifier) @variable.builtin (#eq? @variable.builtin "self"))
