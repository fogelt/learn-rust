/* Build helpers and page templates for the Rust from Zero course. */

const LESSONS = [
  {
    id: "01",
    slug: "hello-rust",
    title: "Hello, Rust!",
    section: "Foundations",
    blurb: "Install the toolchain, meet Cargo, and run your very first program.",
    topics: ["cargo", "main", "println!"],
    minutes: 15,
  },
  {
    id: "02",
    slug: "variables-and-types",
    title: "Variables, Types & Mutability",
    section: "Types & data",
    blurb: "Bindings, mutability, shadowing, and Rust's scalar and compound types.",
    topics: ["let", "mut", "types"],
    minutes: 18,
  },
  {
    id: "03",
    slug: "functions-and-control-flow",
    title: "Functions & Control Flow",
    section: "Logic",
    blurb: "Write functions that return values, then steer with if, loop, while, and for.",
    topics: ["fn", "if", "loops"],
    minutes: 18,
  },
  {
    id: "04",
    slug: "ownership-and-borrowing",
    title: "Ownership & Borrowing",
    section: "Memory",
    blurb: "Rust's superpower: one owner, many borrowers, zero use-after-free.",
    topics: ["move", "borrow", "&mut"],
    minutes: 24,
  },
  {
    id: "05",
    slug: "structs-enums-matching",
    title: "Structs, Enums & Matching",
    section: "Data modelling",
    blurb: "Model data with structs and enums, add methods, and match every possibility.",
    topics: ["struct", "enum", "match"],
    minutes: 22,
  },
  {
    id: "06",
    slug: "collections",
    title: "Vec, String & HashMap",
    section: "Collections",
    blurb: "Grow data at runtime with vectors, build strings, and count with hash maps.",
    topics: ["Vec", "String", "HashMap"],
    minutes: 20,
  },
  {
    id: "07",
    slug: "error-handling",
    title: "Option, Result & Errors",
    section: "Reliability",
    blurb: "Handle missing values and failures without exceptions or null.",
    topics: ["Option", "Result", "?"],
    minutes: 20,
  },
  {
    id: "08",
    slug: "traits-generics-lifetimes",
    title: "Traits, Generics & Lifetimes",
    section: "Abstraction",
    blurb: "Share behaviour with traits, write flexible generics, and read lifetime annotations.",
    topics: ["trait", "generic", "lifetime"],
    minutes: 26,
  },
  {
    id: "09",
    slug: "iterators-and-closures",
    title: "Iterators & Closures",
    section: "Functional Rust",
    blurb: "Chain lazy iterator adapters and capture values in closures.",
    topics: ["closure", "map", "filter"],
    minutes: 18,
  },
  {
    id: "10",
    slug: "modules-and-testing",
    title: "Modules, Crates & Testing",
    section: "Projects",
    blurb: "Split code into modules, add dependencies, and prove it works with tests.",
    topics: ["mod", "cargo", "#[test]"],
    minutes: 22,
  },
];

const TOTAL_QUESTIONS = LESSONS.length * 4;

/* ------------------------------------------------------------------ *
 * Escaping / tiny content helpers
 * ------------------------------------------------------------------ */

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const c = (code) => `<code>${esc(code)}</code>`;

const p = (...parts) => `<p>${parts.join("")}</p>`;
const h3 = (text) => `<h3>${text}</h3>`;
const h4 = (text) => `<h4>${text}</h4>`;

function ul(...items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function ol(...items) {
  return `<ol>${items.map((item) => `<li>${item}</li>`).join("")}</ol>`;
}

function table(headers, rows) {
  return `<div class="table-wrap"><table>
<thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
<tbody>${rows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
    .join("")}</tbody>
</table></div>`;
}

function callout(kind, title, body) {
  return `<div class="callout ${kind}">
<span class="callout-title">${title}</span>
<p>${body}</p>
</div>`;
}

function codeblock(src, file = "main.rs", lang = "rust") {
  const code = src.replace(/^\n+/, "").replace(/\n+$/, "");
  return `<div class="codeblock">
<div class="codeblock-head"><span class="codeblock-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>${esc(file)}</span></div>
<pre><code class="${lang === "rust" ? "rust" : ""}">${esc(code)}</code></pre>
</div>`;
}

/* ------------------------------------------------------------------ *
 * Interactive pieces
 * ------------------------------------------------------------------ */

function playground({ starter, solution, expect, tests = false, file = "main.rs" }) {
  const starterCode = starter.replace(/^\n+/, "").replace(/\n+$/, "");
  const solutionCode = solution
    ? solution
        .replace(/^\n+/, "")
        .replace(/\n+$/, "")
        .replace(/<\/script/gi, "<\\/script")
    : "";
  const expects = expect ? expect.replace(/^\n+/, "").replace(/\n+$/, "") : "";

  return `<div class="playground"${tests ? ' data-tests="true"' : ""}>
<div class="pg-head">
  <div class="pg-title"><span class="pg-dots" aria-hidden="true"><i></i><i></i><i></i></span>${esc(file)} <span class="pg-badge">${tests ? "test mode" : "edition 2021"}</span></div>
  <div class="pg-actions">
    ${solutionCode ? '<button type="button" class="btn btn-ghost pg-solution">Solution</button>' : ""}
    <button type="button" class="btn btn-ghost pg-reset">Reset</button>
    <button type="button" class="btn btn-primary pg-run"><span class="run-label">▶ ${tests ? "Run tests" : "Run"}</span> <kbd>Ctrl ↵</kbd></button>
  </div>
</div>
<div class="editor">
  <pre class="editor-highlight" aria-hidden="true"><code class="rust"></code></pre>
  <textarea class="editor-input" spellcheck="false" wrap="off" autocapitalize="off" autocomplete="off" aria-label="Rust code editor">${esc(starterCode)}</textarea>
</div>
<div class="pg-output" hidden>
  <div class="pg-output-head"><span>Output</span><span class="pg-status idle">ready</span></div>
  <pre class="pg-out" aria-live="polite"></pre>
  <div class="pg-verdict" role="status"></div>
  <div class="pg-warn" hidden>
    <div class="pg-output-head"><span>Compiler notes</span></div>
    <pre></pre>
  </div>
</div>
<div class="pg-note">Runs on the official <a href="https://play.rust-lang.org" target="_blank" rel="noopener">Rust Playground</a> · stable · internet required</div>
${expects ? `<script type="text/plain" class="pg-expect">${expects}</script>` : ""}
${solutionCode ? `<script type="text/plain" class="pg-solution-code">${solutionCode}</script>` : ""}
</div>`;
}

function task({ body, expect, hint, label = "Your turn" }) {
  return `<div class="task">
<span class="task-label">✦ ${label}</span>${body}
${expect ? `<span class="expected" aria-label="Expected output">${esc(expect)}</span>` : ""}
${hint ? `<p class="hint">${hint}</p>` : ""}
</div>`;
}

function quiz(lessonId, questions) {
  const fieldsets = questions
    .map((question, index) => {
      const options = question.options
        .map(
          (option, optionIndex) => `<label class="opt">
<input type="radio" name="q${lessonId}_${index}" value="${optionIndex}">
<span class="opt-key" aria-hidden="true">${"ABCD"[optionIndex]}</span>
<span class="opt-text">${option}</span>
</label>`,
        )
        .join("");

      return `<fieldset class="quiz-q" data-answer="${question.answer}">
<legend><span class="q-num" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span><span>${question.q}</span></legend>
<div class="options">${options}</div>
<div class="explain" hidden><strong>Why:</strong> ${question.explain}</div>
</fieldset>`;
    })
    .join("");

  return `<div class="quiz">
${fieldsets}
<div class="quiz-actions">
<button type="button" class="btn btn-primary quiz-check">Check answers</button>
<button type="button" class="btn btn-ghost quiz-retry">Reset quiz</button>
<span class="quiz-score" role="status" aria-live="polite"></span>
</div>
</div>`;
}

/* ------------------------------------------------------------------ *
 * Page chrome
 * ------------------------------------------------------------------ */

function sidebar(current, root, isIndex = false) {
  const links = LESSONS.map((lesson) => {
    const active = lesson.id === current;
    return `<a href="${root}lessons/${lesson.id}-${lesson.slug}.html" data-lesson-link="${lesson.id}"${
      active ? ' class="active" aria-current="page"' : ""
    }><span class="nav-num" aria-hidden="true">${lesson.id}</span><span>${lesson.title}</span><span class="nav-check" aria-hidden="true">✓</span></a>`;
  }).join("\n");

  return `<aside class="sidebar" id="sidebar">
<a class="brand" href="${root}index.html">
  <span class="brand-mark" aria-hidden="true">🦀</span>
  <span><span class="brand-name">Rust from Zero</span><span class="brand-sub">Interactive Rust lessons</span></span>
</a>
<div class="side-progress">
  <div class="side-progress-top"><span class="side-progress-label">Your progress</span><span class="side-progress-count" data-progress-count>0 / ${LESSONS.length}</span></div>
  <div class="progress-track" data-progress-track role="progressbar" aria-label="Course progress" aria-valuemin="0" aria-valuemax="${LESSONS.length}" aria-valuenow="0"><span class="progress-fill" data-progress-fill></span></div>
</div>
<p class="nav-label">Lessons</p>
<nav class="nav" aria-label="Lessons">
<a href="${root}index.html"${isIndex ? ' class="active" aria-current="page"' : ""}><span class="nav-num" aria-hidden="true">⌂</span><span>Course overview</span></a>
${links}
</nav>
<div class="side-foot">10 short lessons · read, run, quiz.<br><a href="https://www.rust-lang.org/learn" target="_blank" rel="noopener">Official Rust resources ↗</a></div>
</aside>`;
}

function pageShell({ title, description, root, bodyAttrs, current, isIndex, content }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0b0e13">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%A6%80%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="${root}assets/site.css">
</head>
<body ${bodyAttrs}>
<div class="read-progress" aria-hidden="true"><span></span></div>
<div class="shell">
${sidebar(current, root, isIndex)}
<div class="scrim"></div>
<main class="main">
<header class="topbar">
<button class="menu-btn" type="button" aria-label="Open lesson menu" aria-controls="sidebar" aria-expanded="false">☰</button>
<span class="topbar-title">Rust from Zero</span>
<span class="brand-mark" aria-hidden="true">🦀</span>
</header>
${content}
</main>
</div>
<script src="${root}assets/site.js" defer></script>
</body>
</html>`;
}

function lessonNav(lesson) {
  const index = LESSONS.findIndex((item) => item.id === lesson.id);
  const previous = index > 0 ? LESSONS[index - 1] : null;
  const next = index < LESSONS.length - 1 ? LESSONS[index + 1] : null;

  const previousHref = previous
    ? `${previous.id}-${previous.slug}.html`
    : "../index.html";
  const nextHref = next ? `${next.id}-${next.slug}.html` : "../index.html";
  const previousName = previous
    ? `<span>${previous.id}</span> ${previous.title}`
    : "Course overview";
  const nextName = next
    ? `<span>${next.id}</span> ${next.title}`
    : "Back to course overview";

  return `<nav class="lesson-nav" aria-label="Lesson navigation">
<a class="nav-card" href="${previousHref}"><span class="dir">← Previous</span><span class="name">${previousName}</span></a>
<a class="nav-card next" href="${nextHref}"><span class="dir">Next →</span><span class="name">${nextName}</span></a>
</nav>`;
}

function renderLesson(lesson, content) {
  const read = `<section class="lesson-block" id="read">
<div class="block-head"><span class="step-badge" aria-hidden="true">1</span><h2>Read</h2><span class="block-sub">The idea</span></div>
<div class="prose">${content.read}</div>
</section>`;

  const practice = `<section class="lesson-block" id="practice">
<div class="block-head"><span class="step-badge" aria-hidden="true">2</span><h2>Practice</h2><span class="block-sub">Live compiler</span></div>
${content.practice}
</section>`;

  const quizBlock = `<section class="lesson-block" id="quiz">
<div class="block-head"><span class="step-badge" aria-hidden="true">3</span><h2>Quiz</h2><span class="block-sub">Check yourself</span></div>
<div class="prose quiz-intro"><p>Four questions. Get three or more right to complete the lesson — you can retry as often as you like.</p></div>
${quiz(lesson.id, content.questions)}
</section>`;

  const page = `<div class="content">
<header class="lesson-hero">
<span class="eyebrow">Lesson ${lesson.id} · ${lesson.section}</span>
<h1 class="lesson-title">${lesson.title}</h1>
<p class="lede">${content.lede}</p>
<div class="lesson-meta">
<span class="pill">⏱ <strong>${lesson.minutes} min</strong></span>
<span class="pill">🦀 <strong>Beginner</strong></span>
<span class="pill">✎ <strong>1 exercise</strong></span>
<span class="pill" data-complete-pill hidden>✓ <strong>Completed</strong></span>
</div>
</header>
${read}
${practice}
${quizBlock}
${lessonNav(lesson)}
<p class="page-foot">Lesson ${lesson.id} of ${LESSONS.length} · <a href="../index.html">Course overview</a></p>
</div>`;

  return pageShell({
    title: `${lesson.id} · ${lesson.title} — Rust from Zero`,
    description: content.lede,
    root: "../",
    bodyAttrs: `data-lesson="${lesson.id}" data-total="${LESSONS.length}"`,
    current: lesson.id,
    isIndex: false,
    content: page,
  });
}

/* ------------------------------------------------------------------ *
 * Landing page
 * ------------------------------------------------------------------ */

function renderIndex() {
  const cards = LESSONS.map(
    (lesson) => `<a class="lesson-card" href="lessons/${lesson.id}-${lesson.slug}.html" data-lesson-card="${lesson.id}">
<div class="lesson-card-top"><span class="lesson-num">LESSON ${lesson.id}</span><span class="lesson-done">✓ Complete</span></div>
<h3>${lesson.title}</h3>
<p>${lesson.blurb}</p>
<div class="chips">${lesson.topics.map((topic) => `<span class="chip">${esc(topic)}</span>`).join("")}</div>
</a>`,
  ).join("\n");

  const heroCode = `<span class="tok-kw">fn</span> main() {
    <span class="tok-kw">let</span> crab = <span class="tok-str">"Ferris"</span>;
    <span class="tok-mac">println!</span>(<span class="tok-str">"{crab} says hi 🦀"</span>);
}`;

  const content = `<div class="content index-content">
<section class="hero">
  <div>
    <span class="eyebrow">Interactive Rust course</span>
    <h1>Learn Rust<br><span class="accent">by doing.</span></h1>
    <p class="lede">Ten short lessons that take you from your first <code>println!</code> to ownership, traits, iterators, and tests. Every lesson has a real editor that compiles Rust, plus a quiz to lock it in.</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="lessons/01-hello-rust.html">Start lesson 01 →</a>
      <a class="btn btn-secondary" href="#curriculum">Browse the curriculum</a>
    </div>
    <div class="hero-stats">
      <div class="hero-stat"><b>${LESSONS.length}</b><span>LESSONS</span></div>
      <div class="hero-stat"><b>${TOTAL_QUESTIONS}</b><span>QUIZ QUESTIONS</span></div>
      <div class="hero-stat"><b>${LESSONS.length}</b><span>LIVE EXERCISES</span></div>
    </div>
  </div>
  <aside class="hero-card">
    <div class="hero-card-top"><span>main.rs</span><span class="live">live playground</span></div>
    <pre class="hero-code">${heroCode}</pre>
    <div class="hero-run"><span>›</span> cargo run <b>· Ferris says hi 🦀</b></div>
    <div class="hero-progress">
      <div class="hero-progress-label"><span>Your progress</span><span data-progress-count>0 / ${LESSONS.length}</span></div>
      <div class="progress-track" data-progress-track role="progressbar" aria-label="Course progress" aria-valuemin="0" aria-valuemax="${LESSONS.length}" aria-valuenow="0"><span class="progress-fill" data-progress-fill></span></div>
    </div>
  </aside>
</section>

<section id="curriculum">
  <div class="section-head">
    <div><h2>The curriculum</h2><p>Short lessons, ordered so each one builds on the last.</p></div>
    <span class="count">${LESSONS.length} LESSONS · ${TOTAL_QUESTIONS} QUESTIONS</span>
  </div>
  <div class="course-grid">
${cards}
  </div>
</section>

<section class="how" id="how-it-works">
  <div class="how-card">
    <div class="how-icon" aria-hidden="true">📖</div>
    <h3>1 · Read</h3>
    <p>Plain-English explanations with small, focused code samples. No compiler magic hidden behind frameworks.</p>
  </div>
  <div class="how-card">
    <div class="how-icon" aria-hidden="true">⌨️</div>
    <h3>2 · Practice</h3>
    <p>Edit real Rust in the browser. Run it against the official Rust compiler, see errors, and fix them.</p>
  </div>
  <div class="how-card">
    <div class="how-icon" aria-hidden="true">✓</div>
    <h3>3 · Quiz</h3>
    <p>Four questions per lesson with explanations. Score 3 or better to mark the lesson complete.</p>
  </div>
</section>

<footer class="index-foot">
  <p>Progress lives in your browser (localStorage) — nothing is uploaded. Practice code is compiled by the official <a href="https://play.rust-lang.org" target="_blank" rel="noopener">Rust Playground</a>, so exercises need an internet connection.</p>
  <p>Prefer to work locally? Install Rust with <a href="https://rustup.rs" target="_blank" rel="noopener">rustup</a>, then use <code>cargo new</code> and <code>cargo run</code>. Further reading: <a href="https://doc.rust-lang.org/book/" target="_blank" rel="noopener">The Rust Programming Language</a> and <a href="https://github.com/rust-lang/rustlings" target="_blank" rel="noopener">Rustlings</a>.</p>
</footer>
</div>`;

  return pageShell({
    title: "Rust from Zero — Interactive Rust lessons",
    description:
      "Learn Rust in ten interactive lessons. Read a short explanation, edit and run real Rust in your browser, then take a quiz.",
    root: "",
    bodyAttrs: `data-total="${LESSONS.length}"`,
    current: null,
    isIndex: true,
    content,
  });
}

module.exports = {
  LESSONS,
  TOTAL_QUESTIONS,
  esc,
  c,
  p,
  h3,
  h4,
  ul,
  ol,
  table,
  callout,
  codeblock,
  playground,
  task,
  quiz,
  renderLesson,
  renderIndex,
};
