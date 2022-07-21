; Highlights.scm for gab

(identifier) @variable


(object key: (identifier) @variable.other.member)
(property property: (identifier) @variable.other.member)

(call receiver: (identifier) @function)
(method method: (call receiver: (property receiver: (identifier) @type)))
(call receiver: (property property: (identifier) @function ))

(method method: (identifier) @function)
(function_definition name: (identifier) @function)
(object_definition name: (identifier) @type)
(list_definition name: (identifier) @type)

(comment) @comment

(number) @constant.numeric

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
 "in"
 "while"
 "if"
 "match"
 "else"
 "return"
 "=>"
] @keyword.control

[
  "or"
  "and"
  "not"
  "is"
] @keyword.operator


[
  "let"
  "def"
] @keyword.storage.type

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
] @operator

(global bang: ("!") @variable.builtin)
(global name: (identifier) @variable.builtin)


