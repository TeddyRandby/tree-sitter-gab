; Highlights.scm for gab

(comment) @comment

(number) @number

(identifier) @variable

((identifier) @variable.builtin (#eq? @variable.builtin "self"))

[
 (bool)
 (null)
] @boolean

[
  (string)
  (rawstring)
  (interpstring)
] @string

[
 "for"
 "loop"
 "until"
] @repeat

[
 "if"
 "else"
 "match"
] @conditional

[
 "return"
] @keyword.return

[
  "or"
  "and"
  "not"
  "is"
  "in"
] @keyword.operator

[
  "let"
  "def"
] @keyword.storage.type

[
  ","
  "."
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
  ":"
  "=>"
] @operator

[
 "$"
] @string.special

(symbol (identifier) @string.special)

(parameters (identifier) @parameter)

(property property: (identifier) @field)

(method message: (identifier) @method.call)

(function_definition type: (identifier) @type)

(function_definition name: (identifier) @method)
(object_definition name: (identifier) @type)

(record key: (identifier) @field)
