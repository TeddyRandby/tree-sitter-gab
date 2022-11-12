; Highlights.scm for gab

(comment) @comment

(number) @constant.numeric

(identifier) @variable

[
 (bool)
 (null)
] @constant.builtin

[
  (string)
  (rawstring)
  (interpstring)
] @string

[
 "for"
 "loop"
 "until"
] @keyword.repeat

[
 "if"
 "else"
 "match"
 "return"
] @conditional

[
  "or"
  "and"
  "not"
  "is"
  "in"
  "=>"
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
  "|"
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
] @operator

(chain: (identifier) @type)
(chain_final: (identifier) @function)

(parameters (identifier) @parameter)
(function_definition name: (identifier) @function)
(object_definition name: (identifier) @type)
