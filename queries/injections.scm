(call
  callee: (identifier) @injection.language
  [
   (string (stringcontent)  @injection.content)
   (string (rawstringcontent)  @injection.content)
  ])

(send
  message: (message (identifier) @injection.language)
  [
   (string (stringcontent)  @injection.content)
   (string (rawstringcontent)  @injection.content)
  ])
