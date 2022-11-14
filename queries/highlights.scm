; Highlights.scm for gab

(comment) @comment

(number) @number

(identifier) @variable

(eq (identifer) "self" @variable.builtin)

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

(symbol (identifier) @variable.builtin)

(parameters (identifier) @parameter)

(property property: (identifier) @field)

(chain chain: (identifier) @type)
(chain final: (identifier) @method.call)

(function_definition type: (identifier) @type)

(function_definition name: (identifier) @method)
(object_definition name: (identifier) @type)
