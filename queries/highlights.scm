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
] @string

[
 "for"
 "in"
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
] @keyword.operator

[
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

(call callee: (identifier) @method.call)

(message name: (identifier) @method.call)

(parameters (identifier) @parameter)

(function_definition name: (identifier) @method)

(function_definition type: (identifier) @type)

(object_definition name: (identifier) @type)

(property property: (identifier) @field)

(record key: (identifier) @field)
