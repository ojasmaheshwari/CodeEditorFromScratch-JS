A Code Editor with syntax highlighting from Scratch made in HTML, CSS and Javascript

![Screenshot_2024-12-29_23-47-10](https://github.com/user-attachments/assets/d4971338-d930-467a-b3d2-4769065dbf40)

## Live version [here](https://code-editor-from-scratch.netlify.app/)

Note: This project is not intended for production and thus may have unexpected behaviors. See section 'Known Bugs'

## Working Details
- Uses Range and Selection API in Javascript to manage position of cursor/caret inside editor.
- Each line of code is a block-display div. Now I know this is bad and I should have used a Rope/SumTree data structure as done by the devs of Zed, but since I did not do any kind of parsing, I felt this was okay.
- I use regex rules to syntax-highlight the code. This is bad, I could have switched to my own custom lexer I wrote, but I had already spent a lot of time on the regex module so I used just that.
- I wrote a simple Lexer for C++ which I then use to extract keywords, variables and datatypes.
- I use Levenshtein edit distance algorithm for judging similarity of two strings. It is not very accurate because edit distance is not the only viable measure of similarity but it is decent enough. I can develop additional algorithms on top of Levenshtein's in order to improve it.
- Use default tab navigation and some other nifty tricks in order to do the auto-complete trigger part.

## Future todo stuff
- Optimizing using Rope/SumTree or a more refined "one-div-per-keyword" model.
- Embedding my own C Parser using WebAssembly inside the editor.
- Remove Regex Portion. Fully depending ona lexer and a parser instead.
- Refactor code and improve performance.
- Fixing Caret bugs.

## Credits
Zserge:- [Blog](https://zserge.com/posts/js-editor/)
<br>
Jsmith:- [Simple VM C++ Code](https://cplusplus.com/forum/lounge/13042/#msg63791)
<br>
Wallpaper's Den:- [OPM Wallpaper](https://wallpapersden.com/saitama-s-power-punch-one-punch-man-wallpaper/)

## Known Bugs
- Backspacing on an empty line moves the caret to the end of the line above. Reproducible without any effort.
- Sometimes pasting code causes extra empty lines in between across the whole code. No guaranteed steps known to reproduce as of now.
- A lot more, just use it and you will them

Care to fix? I accept contributors.
