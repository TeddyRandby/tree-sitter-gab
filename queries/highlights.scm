; Highlights.scm for gab

"def" @keyword.function

[
  "do"
  "end"
] @keyword

[
 "for"
 "in"
 "while"
] @keyword.repeat

[
  "or"
  "and"
  "not"
] @keyword.operator

"return" @keyword.return

(comment) @comment

(number) @number
[
 (bool)
 (null)
] @constant.builtin

[
  (string)
  (rawstring)
] @string

(identifier) @variable

(function_definition name: (identifier) @definition.function)
(object_definition name: (identifier) @definition.type)
(list_definition name: (identifier) @definition.enum)

(lambda parameters: (identifier) @parameter)
(function_definition parameters: (identifier) @parameter)
(method parameters: (identifier) @parameter)
(call parameters: (identifier) @parameter)

(object key: (identifier) @property)
(object value: (identifier) @value)

(obj_call receiver: (identifier) @receiver)
(call receiver: (identifier) @receiver)
(method receiver: (identifier) @receiver)

(property property: (identifier) @property)
(method name: (identifier) @method)

(global name: (identifier) @variable.builtin)
