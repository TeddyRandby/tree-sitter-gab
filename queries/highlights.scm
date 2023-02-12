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
  (rawstring)
  (interpstring)
] @string

[
 "impl"
] @type.definition

[
 "for"
 "loop"
 "until"
] @repeat

[
 "match"
 "and"
 "or"
 "then"
 "else"
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
  ":"
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
  "?"
  "=>"
  "&"
  "|"
  ">>"
  "<<"
] @operator

(impl name: (identifier) @type)

(message name: (identifier) @method.call)

(function_definition name: (identifier) @method)

(call callee: (identifier) @method.call)

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
