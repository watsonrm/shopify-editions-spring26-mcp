# VHS tape — records demo.gif for the Shopify Editions Spring '26 MCP.
# Short cut tuned for LinkedIn autoplay (~14s): hero scene + one punchy scene.
#   brew install vhs   (https://github.com/charmbracelet/vhs)
#   vhs demo.tape      → writes demo.gif
Output demo.gif

Set Shell "bash"
Set FontSize 16
Set Width 1200
Set Height 640
Set Padding 24
Set Theme "Catppuccin Mocha"
Set TypingSpeed 28ms
Set PlaybackSpeed 1

Hide
Type "clear" Enter
Show

Sleep 400ms
Type "# doc-teaming: one claim, corroborated across every doc surface." Enter
Sleep 900ms
Type "node demo.js doc_teaming" Enter
Sleep 6s

Type "# shipped vs marketing, separated — not blended." Enter
Sleep 700ms
Type "node demo.js customers" Enter
Sleep 4.5s
