(assignment left: (_) @assignment.lhs)
(assignment right: (_) @assignment.rhs)
(assignment) @assignment.outer

(body) @block.outer
(body _* @block.inner)

(function_definition) @function.outer
(function_definition (body) @function.inner)

(loop) @loop.outer
(loop (body) @loop.inner)

(object_definition) @class.outer
(object_definition value: (record (record_item) @class.inner))

(parameters) @parameters.outer
(parameters (identifier) @parameters.inner)

(return) @return.outer
(return _* @return.inner)

(send) @call.outer
(send arguments: _* @call.inner)
