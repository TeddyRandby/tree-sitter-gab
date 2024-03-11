((binary
  message: (message (identifier) @injection.language)
  rhs: (string [
    (interpbegin)
    (interpmiddle)
    (interpend)
    (doublestring)
    (singlestring)
  ] @injection.content) .)
  (#set! injection.combined)
  (#offset! @injection.content 0 1 0 -1))

((call
  lhs: (identifier) @injection.language
  rhs: (string [
    (doublestring)
    (singlestring)
  ] @injection.content) .)
  (#offset! @injection.content 0 1 0 -1))
