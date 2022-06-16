(lambda) @local.scope
(function_definition) @local.scope
(for) @local.scope
(while) @local.scope
(block) @local.scope

(function_definition parameters: (identifier) @local.definition)
(lambda parameters: (identifier) @local.definition)

(assignment left: (identifier) @local.definition)

(identifier) @local.reference
