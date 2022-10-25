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
 "while"
] @repeat

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

(property
  receiver: (identifier) @type)

(call
  receiver: (identifier) @function)

(call
  receiver: (property 
      property: (identifier) @function))

(method method: (identifier) @function)
(function_definition parameters: (identifier) @parameter)
(function_definition name: (identifier) @function)
(lambda parameters: (identifier) @parameter)
(object_definition name: (identifier) @type)
(list_definition name: (identifier) @type)

(global bang: ("!") @variable.builtin)
(global name: (identifier) @variable.builtin)
