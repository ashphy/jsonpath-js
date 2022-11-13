ABNF for JSONPath

https://www.ietf.org/archive/id/draft-ietf-jsonpath-base-07.html

```ABNF
; 3.2. Syntax
json-path = root-selector *(S (dot-selector        /
                               dot-wild-selector   /
                               index-selector      /
                               index-wild-selector /
                               slice-selector      /
                               filter-selector     /
                               list-selector       /
                               descendant-selector))

; 3.4.1. Root Selector
root-selector  = "$"

; 3.4.2. Dot Selector
dot-selector    = "." dot-member-name
dot-member-name = name-first *name-char
name-first      =
                      ALPHA /
                      "_"   /           ; _
                      %x80-10FFFF       ; any non-ASCII Unicode character
name-char = DIGIT / name-first

DIGIT           =  %x30-39              ; 0-9
ALPHA           =  %x41-5A / %x61-7A    ; A-Z / a-z

; 3.4.3. Dot Wildcard Selector
dot-wild-selector    = "." wildcard       ;  dot followed by asterisk
wildcard             = "*"

; 3.4.4. Index Selector
index-selector      = "[" S (quoted-member-name / element-index) S "]"

quoted-member-name  = string-literal

string-literal      = %x22 *double-quoted %x22 /       ; "string"
                      %x27 *single-quoted %x27         ; 'string'

double-quoted       = unescaped /
                      %x27      /                       ; '
                      ESC %x22  /                       ; \"
                      ESC escapable

single-quoted       = unescaped /
                      %x22      /                       ; "
                      ESC %x27  /                       ; \'
                      ESC escapable

ESC                 = %x5C                              ; \  backslash

unescaped           = %x20-21 /                         ; s. RFC 8259
                      %x23-26 /                         ; omit "
                      %x28-5B /                         ; omit '
                      %x5D-10FFFF                       ; omit \

escapable           = ( %x62 / %x66 / %x6E / %x72 / %x74 / ; \b \f \n \r \t
                          ; b /         ;  BS backspace U+0008
                          ; t /         ;  HT horizontal tab U+0009
                          ; n /         ;  LF line feed U+000A
                          ; f /         ;  FF form feed U+000C
                          ; r /         ;  CR carriage return U+000D
                          "/" /          ;  /  slash (solidus) U+002F
                          "\\" /          ;  \  backslash (reverse solidus) U+005C
                          (%x75 hexchar) ;  uXXXX      U+XXXX
                      )

hexchar = non-surrogate / (high-surrogate "\" %x75 low-surrogate)
non-surrogate = ((DIGIT / "A"/"B"/"C" / "E"/"F") 3HEXDIG) /
                 ("D" %x30-37 2HEXDIG )
high-surrogate = "D" ("8"/"9"/"A"/"B") 2HEXDIG
low-surrogate = "D" ("C"/"D"/"E"/"F") 2HEXDIG

HEXDIG = DIGIT / "A" / "B" / "C" / "D" / "E" / "F"

element-index   = int                             ; decimal integer

int             = ["-"] ( "0" / (DIGIT1 *DIGIT) ) ; -  optional
DIGIT1          = %x31-39                         ; 1-9 non-zero digit

; 3.4.5. Index Wildcard Selector
index-wild-selector    = "[" wildcard "]"  ;  asterisk enclosed by brackets

; 3.4.6. Array Slice Selector
slice-selector = "[" S slice-index S "]"

slice-index    =  [start S] ":" S [end S] [":" [S step ]]

start          = int       ; included in selection
end            = int       ; not included in selection
step           = int       ; default: 1

B              =    %x20 / ; Space
                    %x09 / ; Horizontal tab
                    %x0A / ; Line feed or New line
                    %x0D   ; Carriage return
S              = *B        ; optional blank space
RS             = 1*B       ; required blank space

; 3.4.7. Filter Selector
filter-selector    = "[" S filter S "]"
filter             = "?" S boolean-expr

boolean-expr     = logical-or-expr
logical-or-expr  = logical-and-expr *(S "||" S logical-and-expr)
                                                      ; disjunction
                                                      ; binds less tightly than conjunction
logical-and-expr = basic-expr *(S "&&" S basic-expr)  ; conjunction
                                                      ; binds more tightly than disjunction

basic-expr        = exist-expr /
                    paren-expr /
                    relation-expr
exist-expr        = [logical-not-op S] singular-path  ; path existence or non-existence

singular-path     = rel-singular-path / abs-singular-path
rel-singular-path = "@" *(S (dot-selector / index-selector))
abs-singular-path = root-selector *(S (dot-selector / index-selector))

paren-expr        = [logical-not-op S] "(" S boolean-expr S ")"
                                                      ; parenthesized expression
logical-not-op    = "!"                               ; logical NOT operator

relation-expr = comp-expr /                           ; comparison test
                regex-expr                            ; regular expression test

comp-expr    = comparable S comp-op S comparable
comparable   = number / string-literal /              ; primitive ...
               true / false / null /                  ; values only
               singular-path                          ; Singular Path value
comp-op      = "==" / "!=" /                          ; comparison ...
               "<"  / ">"  /                          ; operators
               "<=" / ">="

number       = int [ frac ] [ exp ]                   ; decimal number
frac         = "." 1*DIGIT                            ; decimal fraction
exp          = "e" [ "-" / "+" ] 1*DIGIT              ; decimal exponent
true         = %x74.72.75.65                          ; true
false        = %x66.61.6c.73.65                       ; false
null         = %x6e.75.6c.6c                          ; null

regex-expr   = (singular-path / string-literal) S regex-op S regex
regex-op     = "=~"                                   ; regular expression match
regex        = string-literal                         ; I-Regexp

; 3.4.8. List Selector
list-selector  = "[" S list-entry 1*(S "," S list-entry) S "]"

list-entry     =  ( quoted-member-name /
                    element-index      /
                    slice-index /
                    filter
                  )

; 3.4.9. Descendant Selectors
descendant-selector = ".." ( dot-member-name      /  ; ..<name>
                             wildcard             /  ; ..*
                             index-selector       /  ; ..[<index>]
                             index-wild-selector  /  ; ..[*]
                             slice-selector       /  ; ..[<slice-index>]
                             filter-selector      /  ; ..[<filter>]
                             list-selector           ; ..[<list-entry>,...]
                           )

; 3.6. Normalized Paths
normalized-path           = root-selector *(normal-index-selector)
normal-index-selector     = "[" (normal-quoted-member-name / normal-element-index) "]"
normal-quoted-member-name = %x27 *normal-single-quoted %x27 ; 'string'
normal-single-quoted      = normal-unescaped /
                            ESC normal-escapable
normal-unescaped          = %x20-26 /                       ; omit control codes
                            %x28-5B /                       ; omit '
                            %x5D-10FFFF                     ; omit \
normal-escapable          = ( %x62 / %x66 / %x6E / %x72 / %x74 / ; \b \f \n \r \t
                                ; b /         ;  BS backspace U+0008
                                ; t /         ;  HT horizontal tab U+0009
                                ; n /         ;  LF line feed U+000A
                                ; f /         ;  FF form feed U+000C
                                ; r /         ;  CR carriage return U+000D
                                "'" /         ;  ' apostrophe U+0027
                                "\" /         ;  \ backslash (reverse solidus) U+005C
                                (%x75 normal-hexchar) ;  certain values u00xx U+00XX
                            )
normal-hexchar            = "0" "0"
                            (
                              ("0" %x30-37) / ; "00"-"07"
                              ("0" %x62) /    ; "0b"      ; omit U+0008-U+000A
                              ("0" %x65-66) /  ; "0e"-"0f" ; omit U+000C-U+000D
                              ("1" normal-HEXDIG)
                            )
normal-HEXDIG             = DIGIT / %x61-66   ; "0"-"9", "a"-"f"
normal-element-index      = "0" / (DIGIT1 *DIGIT) ; non-negative decimal integer
```
