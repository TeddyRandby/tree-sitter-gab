((binary
  lhs: (string [
    (interpbegin)
    (interpmiddle)
    (interpend)
    (doublestring)
    (singlestring)
  ] @injection.content)
  message: ((message) @injection.language (#offset! @injection.language 0 1 0 0)))
  (#set! injection.combined)
  (#offset! @injection.content 0 1 0 -1))

((unary
  lhs: (string [
    (interpbegin)
    (interpmiddle)
    (interpend)
    (doublestring)
    (singlestring)
  ] @injection.content)
  message: ((message) @injection.language (#offset! @injection.language 0 1 0 0)))
  (#set! injection.combined)
  (#offset! @injection.content 0 1 0 -1))
