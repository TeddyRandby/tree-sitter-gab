((send
  message: (message (identifier) @injection.language)
  argument: (string [
    (doublestring)
    (singlestring)
  ] @injection.content) .)
  (#offset! @injection.content 0 1 0 -1))

((send
  message: (message (identifier) @injection.language)
  argument: (string [
    (interpbegin)
    (interpmiddle)
    (interpend)
  ] @injection.content) .)
  (#set! injection.combined)
  (#offset! @injection.content 0 1 0 -1))

((strcall
  callee: (identifier) @injection.language
  argument: (string [
    (doublestring)
    (singlestring)
  ] @injection.content) .)
  (#offset! @injection.content 0 1 0 -1))

((call
  callee: (identifier) @injection.language
  argument: (string [
    (doublestring)
    (singlestring)
  ] @injection.content) .)
  (#offset! @injection.content 0 1 0 -1))

((strcall
  callee: (identifier) @injection.language
  argument: (string [
    (interpbegin)
    (interpmiddle)
    (interpend)
  ] @injection.content) .)
  (#set! injection.combined)
  (#offset! @injection.content 0 1 0 -1))

((call
  callee: (identifier) @injection.language
  argument: (string [
    (interpbegin)
    (interpmiddle)
    (interpend)
  ] @injection.content) .)
  (#set! injection.combined)
  (#offset! @injection.content 0 1 0 -1))
