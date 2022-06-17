; Highlights.scm for gab

"def" @keyword.function

[
 "for"
 "in"
 "while"
] @repeat

[
  "or"
  "and"
  "not"
] @keyword.operator

[
  "if"
  "match"
  "else"
] @conditional

[
  "let"
] @keyword

[
 ","
 ":"
] @punctuation.delimiter

[
  "+"
  "-"
  "%"
  "*"
  "/"
  "="
  "=="
  "<"
  "<="
  ">"
  ">="
  "!"
  "?"
  ".."
] @operator

[
  "."
  "->"
] @field

[
  "{"
  "}"
  "["
  "]"
  "("
  ")"
  "|"
  "do"
  "end"
] @punctuation.bracket

[
 "return"
 "=>"
] @keyword.return

(comment) @comment

(number) @number

[
 (bool)
 (null)
] @constant.builtin

[
  (string)
  (rawstring)
] @string

(identifier) @variable

(function_definition name: (identifier) @type.definition)
(object_definition name: (identifier) @type.definition)
(list_definition name: (identifier) @type.definition)

(call parameters: (identifier) @parameter)

(object key: (identifier) @property)
(property name: (identifier) @property)

(call receiver: (identifier) @function)
(method name: (identifier) @method)

(global name: (identifier) @variable.builtin)
(global bang: ("!") @variable.builtin)
