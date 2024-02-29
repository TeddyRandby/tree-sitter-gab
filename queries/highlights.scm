; Highlights.scm for gab
(comment) @comment

(number) @number

(identifier) @variable
((identifier) @variable.builtin (#eq? @variable.builtin "self"))
((identifier) @variable.parameter (#lua-match? @variable.parameter "^%@[0-9]*"))

(symbol) @string.special

[
 (bool)
 (nil)
] @boolean

[
  (string)
] @string

[
 "yield"
 "return"
 "=>"
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
  "^"
  ".."
] @operator

[
 (call callee: (identifier))
 (blkcall callee: (identifier))
 (symcall callee: (identifier))
 (strcall callee: (identifier))
 (reccall callee: (identifier))
] @method.call

(send (message name: (identifier) @constructor))

(send
       receiver: (_)
       message: (message name: (identifier) @method.call)
)

(parameters (identifier) @parameter)

(function_definition name: (identifier) @method)

(function_definition type: (identifier) @type)

(object_definition name: (identifier) @type)

(record_item key: (identifier) @field)
