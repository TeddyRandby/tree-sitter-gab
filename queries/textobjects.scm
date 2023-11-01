(assignment left: (_) @assignment.lhs)
(assignment right: (_) @assignment.rhs)
(assignment) @assignment.outer

(body) @block.outer
(body . (_) @_start (_)? @_end .
      (#make-range! "block.inner" @_start @_end))

(function_definition) @function.outer
(function_definition (body) @function.inner)

(loop) @loop.outer
(loop (body) @loop.inner)

(object_definition) @class.outer
(object_definition
  value: (record . "{" . (_) @_start (_)? @_end . "}"
  (#make-range! "class.inner" @_start @_end)))

(parameters) @parameters.outer
(parameters (identifier) @parameters.inner)

(return) @return.outer
(return _* @return.inner)

(send) @call.outer
(send argument: _* @call.inner)
