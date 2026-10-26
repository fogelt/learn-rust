# Rust from Zero

A static, interactive Rust course: **10 lessons**, each with a text explanation, a live coding exercise, and a four-question quiz.

## Open it

Double-click `index.html`, or serve the folder locally:

```bash
node tools/serve.js
# then open http://localhost:4173
```

The practice editors send code to the official [Rust Playground](https://play.rust-lang.org), so they need an internet connection. Everything else works offline.

## What's inside

```
index.html                  course overview + progress
lessons/                    one self-contained HTML page per lesson
  01-hello-rust.html
  ...
  10-modules-and-testing.html
assets/site.css             styles
assets/site.js              highlighting, playgrounds, quizzes, progress
tools/lib.js                build helpers + page templates
tools/content-a.js          lessons 01–05 content
tools/content-b.js          lessons 06–10 content
tools/build.js              regenerates index.html and lessons/
tools/verify.js             compiles every solution against the Playground API
tools/serve.js              tiny local preview server
```

- **Progress** is stored in `localStorage` under `rust-from-zero:progress:v1`. Completing a quiz with 3 of 4 correct marks a lesson done.
- **Solutions** are available in every editor, but the starter code is worth attempting first. Lessons 02, 04, 05, 07, and 10 start with deliberately broken code so you can practise reading compiler and test output.
- **Quiz answers** live in the page markup (`data-answer`), so they are visible to anyone who inspects the source. That is fine for a learning site.

## Editing or rebuilding

Lesson content lives in `tools/content-a.js` and `tools/content-b.js`; the page shell is in `tools/lib.js`.

```bash
node tools/build.js     # write index.html + all lesson pages
node tools/verify.js    # run every solution through the real compiler
```

`verify.js` makes network requests to the Rust Playground and checks every solution's output against the lesson's expected output. Lesson 07's deliberate panic example is reported as a note, because it is meant to compile and then panic at runtime.
