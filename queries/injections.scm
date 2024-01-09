(call
  callee: (identifier) @injection.language
  [
   (string (doublestring)  @injection.content (#offset! @injection.content 0 1 0 -1))
   (string (singlestring)  @injection.content (#offset! @injection.content 0 1 0 -1))
   (string (interpbegin)  @injection.content (#offset! @injection.content 0 1 0 -1))
   (string (interpmiddle)  @injection.content (#offset! @injection.content 0 1 0 -1))
   (string (interpend)  @injection.content (#offset! @injection.content 0 1 0 -1))
  ])

(send
  message: (message (identifier) @injection.language)
  [
   (string (doublestring)  @injection.content (#offset! @injection.content 0 1 0 -1))
   (string (singlestring)  @injection.content (#offset! @injection.content 0 1 0 -1))
   (string (interpbegin)  @injection.content (#offset! @injection.content 0 1 0 -1))
   (string (interpmiddle)  @injection.content (#offset! @injection.content 0 1 0 -1))
   (string (interpend)  @injection.content (#offset! @injection.content 0 1 0 -1))
  ])
