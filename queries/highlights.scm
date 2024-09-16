; Highlights.scm for gab
[
 (comment)
] @comment

(number) @number

(identifier) @variable

(sigil) @string.special

(operator) @operator
(message) @operator
(message_literal) @function

[
  (string)
] @string

[
  ","
 "\;"
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

(parameters (identifier) @parameter)

(record_item key: (identifier) @field)

((identifier) @variable.builtin (#eq? @variable.builtin "self"))
