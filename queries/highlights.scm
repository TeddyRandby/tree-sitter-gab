; Highlights.scm for gab

(comment) @comment

(number) @number

(identifier) @variable

(symbol) @string.special

(message) @method.call

[
 (bool)
 (nil)
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
 "and"
 "or"
 "match"
] @conditional

[
 "yield"
 "return"
] @keyword.return

[
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
  ";"
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
  "=>"
] @operator

(function_definition name: (identifier) @method)

(call message: (identifier) @method.call)

(parameters (identifier) @parameter)

(function_definition type: (identifier) @type)

(object_definition name: (identifier) @type)

(property property: (identifier) @field)

(record key: (identifier) @field)

((identifier) @variable.builtin (#eq? @variable.builtin "self"))
((identifier) @variable.builtin (#eq? @variable.builtin "panic"))
((identifier) @variable.builtin (#eq? @variable.builtin "print"))
((identifier) @type (#eq? @type "Number"))
((identifier) @type (#eq? @type "String"))
((identifier) @type (#eq? @type "Block"))
((identifier) @type (#eq? @type "Message"))
((identifier) @type (#eq? @type "Boolean"))
((identifier) @type (#eq? @type "Effect"))

