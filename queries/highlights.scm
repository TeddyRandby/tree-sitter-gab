; Highlights.scm for gab
(comment) @comment

(number) @number

(identifier) @variable

(symbol) @string.special

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

(parameters (identifier) @parameter)

(record_item key: (identifier) @field)

((identifier) @variable.builtin (#eq? @variable.builtin "self"))
