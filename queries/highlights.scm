; Highlights.scm for gab

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
 "while"
] @repeat

[
 "if"
 "else"
 "match"
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
  "then"
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

(identifier) @variable
(parameters (identifier) @parameter)

(object key: (identifier) @variable.other.member)
(property property: (identifier) @variable.other.member)

(call
  receiver: (identifier) @function)

(call
  receiver: (property
    property: (identifier) @function))

(method
  method: (call
    receiver: (property
      receiver: (identifier) @type)))

(method
  method: (call
    receiver: (property
      receiver: (property
        receiver: (identifier) @type
        property: (identifier) @type))))

(method
  method: (post
    (call
      receiver: (property
        receiver: (identifier) @type))))

(method
  method: (post
    (call
      receiver: (property
        receiver: (property
          receiver: (identifier) @type
          property: (identifier) @type)))))

(method method: (identifier) @function)
(function_definition name: (identifier) @function)
(object_definition name: (identifier) @type)
(list_definition name: (identifier) @type)

(global bang: ("!") @variable.builtin)
(global name: (identifier) @variable.builtin)
