[
  (block)
  (function_definition)
] @scope

(parameters
  (identifier) @definition.parameter
  (#set! "definition.var.scope" "parent"))

(const_definition name: (identifier) @definition.var)
(function_definition name: (identifier) @definition.var)
(object_definition name: (identifier) @definition.var)
(assignment left: (identifier) @definition.var)

(identifier) @reference
