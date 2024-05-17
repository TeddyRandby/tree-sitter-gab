; Highlights.scm for gab
(comment) @comment

(number) @number

(identifier) @variable

(symbol) @string.special

(operator) @operator

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

(message) @method.call
(message name: (identifier) @method.call)

(parameters (identifier) @parameter)

(record_item key: (identifier) @field)

((identifier) @variable.builtin (#eq? @variable.builtin "self"))

(message_literal name: (identifier) @method.call)
(message_literal name: (operator) @operator)
