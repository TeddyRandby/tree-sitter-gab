; Highlights.scm for gab
(comment) @comment

(number) @constant.numeric

[
 (bool)
 (null)
] @constant.builtin

[
  (string)
  (rawstring)
] @string

"def" @keyword.function

[
 "for"
 "in"
 "while"
] @keyword.control.repeat

[
  "or"
  "and"
  "not"
] @keyword.operator

[
  "if"
  "match"
  "else"
] @keyword.control.conditional

[
  "let"
] @keyword

[
 "return"
 "=>"
] @keyword.control.return

[
 ","
 ":"
] @punctuation.delimiter

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
  "."
  "->"
] @operator

(identifier) @variable

(function_definition name: (identifier) @type)

(function_definition parameters: (identifier) @parameter)
(lambda parameters: (identifier) @parameter)

(object_definition name: (identifier) @type)
(list_definition name: (identifier) @type)


(object key: (identifier) @property)
(property property: (identifier) @property)

(call receiver: (identifier) @method)
(method method: (identifier) @method)

(global name: (identifier) @variable.builtin)
(global bang: ("!") @variable.builtin)
