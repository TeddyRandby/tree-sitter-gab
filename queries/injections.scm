(call
  callee: (identifier) @injection.language
  [
   (string (stringcontent)  @injection.content)
   (rawstring (rawstringcontent)  @injection.content)
  ])

(send
  message: (message (identifier) @injection.language)
  [
   (string (stringcontent)  @injection.content)
   (rawstring (rawstringcontent)  @injection.content)
  ])
