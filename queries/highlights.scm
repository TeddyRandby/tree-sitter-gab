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
 "loop"
 "until"
 "break"
] @repeat

[
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
  "in"
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
