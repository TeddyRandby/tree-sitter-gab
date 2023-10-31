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
  ":"
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

(send (message name: (identifier) @function.constructor))

(send
       receiver: (_)
       message: (message name: (identifier) @method.call)
)

(parameters (identifier) @parameter)

(function_definition name: (identifier) @method)

(function_definition type: (identifier) @type)

(object_definition name: (identifier) @type)

(record key: (identifier) @field)
