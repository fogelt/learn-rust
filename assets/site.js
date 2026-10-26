/* ==========================================================================
   Rust from Zero — shared behaviour
   - syntax highlighting
   - progress tracking (localStorage)
   - live Rust playgrounds (official play.rust-lang.org API)
   - quizzes
   ========================================================================== */

(() => {
  "use strict";

  const STORAGE_KEY = "rust-from-zero:progress:v1";
  const PLAYGROUND_API = "https://play.rust-lang.org/execute";
  const PASS_RATIO = 0.7;

  /* ------------------------------------------------------------------ *
   * Progress storage
   * ------------------------------------------------------------------ */

  function readProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : {};
      return {
        lessons: data.lessons && typeof data.lessons === "object" ? data.lessons : {},
        quizzes: data.quizzes && typeof data.quizzes === "object" ? data.quizzes : {},
      };
    } catch {
      return { lessons: {}, quizzes: {} };
    }
  }

  const progress = readProgress();

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      /* storage may be unavailable (private mode / file://); progress is optional */
    }
  }

  function isComplete(id) {
    return Boolean(progress.lessons[id]);
  }

  function totalLessons() {
    return Number(document.body.dataset.total) || 10;
  }

  function completedCount() {
    const ids = Object.keys(progress.lessons);
    return ids.filter((id) => /^\d{2}$/.test(id)).length;
  }

  function syncChrome() {
    const total = totalLessons();
    const done = completedCount();

    document.querySelectorAll("[data-lesson-link]").forEach((link) => {
      link.classList.toggle("done", isComplete(link.dataset.lessonLink));
    });

    document.querySelectorAll("[data-progress-count]").forEach((el) => {
      el.textContent = `${done} / ${total}`;
    });

    document.querySelectorAll("[data-progress-fill]").forEach((el) => {
      el.style.width = `${total ? (done / total) * 100 : 0}%`;
    });

    document.querySelectorAll("[data-progress-track]").forEach((el) => {
      el.setAttribute("aria-valuenow", String(done));
    });

    document.querySelectorAll("[data-lesson-card]").forEach((card) => {
      card.classList.toggle("done", isComplete(card.dataset.lessonCard));
    });

    document.querySelectorAll("[data-complete-pill]").forEach((pill) => {
      pill.hidden = !isComplete(document.body.dataset.lesson);
    });
  }

  let toastTimer;
  function toast(message) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.innerHTML = `<span class="toast-icon" aria-hidden="true">✓</span><span>${message}</span>`;
    requestAnimationFrame(() => el.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 3800);
  }

  function markComplete(id, score, total) {
    if (!id) return;
    const firstTime = !isComplete(id);
    progress.lessons[id] = {
      score,
      total,
      completedAt: new Date().toISOString(),
    };
    progress.quizzes[id] = { score, total };
    saveProgress();
    syncChrome();
    if (firstTime) {
      const n = completedCount();
      toast(`Lesson ${id} complete — ${n} of ${totalLessons()} done.`);
    }
  }

  /* ------------------------------------------------------------------ *
   * Rust syntax highlighting (small, good enough, no dependencies)
   * ------------------------------------------------------------------ */

  const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;" };
  const escapeHtml = (s) => s.replace(/[&<>]/g, (ch) => HTML_ESCAPES[ch]);

  const TOKEN_CLASSES = [
    "tok-com", // 1 comments
    "tok-str", // 2 strings & chars
    "tok-attr", // 3 attributes
    "tok-num", // 4 numbers
    "tok-kw", // 5 keywords
    "tok-mac", // 6 macro calls
    "tok-builtin", // 7 std prelude names
    "tok-type", // 8 other capitalised identifiers
  ];

  function highlightRust(code) {
    const pattern =
      /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])')|(#!?\[[^\]\n]*\])|(\b(?:0x[0-9a-fA-F_]+|0b[01_]+|0o[0-7_]+|\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?)(?:[iuf](?:8|16|32|64|128|size))?\b)|(\b(?:fn|let|mut|const|static|struct|enum|impl|trait|pub|use|mod|match|if|else|loop|while|for|in|return|break|continue|where|as|ref|move|dyn|unsafe|async|await|Self|self|crate|super|type|extern|true|false|union)\b)|([A-Za-z_][A-Za-z0-9_]*(?=\s*!))|(\b(?:i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|bool|char|str|String|Vec|Option|Result|Some|None|Ok|Err|Box|HashMap|BTreeMap|HashSet|Rc|Arc|RefCell|Cell|Mutex|thread|println|print|format|vec|panic|assert|assert_eq|assert_ne|write|writeln|dbg|todo|unimplemented)\b)|([A-Z][A-Za-z0-9_]*)/g;

    let out = "";
    let last = 0;
    let match;
    while ((match = pattern.exec(code)) !== null) {
      out += escapeHtml(code.slice(last, match.index));
      let cls = "tok-type";
      for (let i = 1; i <= 8; i += 1) {
        if (match[i] !== undefined) {
          cls = TOKEN_CLASSES[i - 1];
          break;
        }
      }
      out += `<span class="${cls}">${escapeHtml(match[0])}</span>`;
      last = pattern.lastIndex;
    }
    out += escapeHtml(code.slice(last));
    return out;
  }

  /* ------------------------------------------------------------------ *
   * Static code blocks + copy buttons
   * ------------------------------------------------------------------ */

  function initCodeBlocks() {
    document.querySelectorAll("pre code.rust").forEach((code) => {
      if (code.dataset.highlighted === "true") return;
      code.innerHTML = highlightRust(code.textContent);
      code.dataset.highlighted = "true";
    });

    document.querySelectorAll(".codeblock").forEach((block) => {
      const head = block.querySelector(".codeblock-head");
      const code = block.querySelector("pre code");
      if (!head || !code || head.querySelector(".copy-btn")) return;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = "Copy";
      btn.setAttribute("aria-label", "Copy code to clipboard");
      btn.addEventListener("click", async () => {
        const text = code.textContent;
        let copied = false;
        try {
          await navigator.clipboard.writeText(text);
          copied = true;
        } catch {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          try {
            copied = document.execCommand("copy");
          } catch {
            copied = false;
          }
          ta.remove();
        }
        btn.textContent = copied ? "Copied ✓" : "Press Ctrl+C";
        btn.classList.toggle("copied", copied);
        setTimeout(() => {
          btn.textContent = "Copy";
          btn.classList.remove("copied");
        }, 1800);
      });
      head.appendChild(btn);
    });
  }

  /* ------------------------------------------------------------------ *
   * Playgrounds
   * ------------------------------------------------------------------ */

  const stripAnsi = (s) => s.replace(/\u001b\[[0-9;]*[A-Za-z]/g, "");

  function cleanCompiler(stderr) {
    return stripAnsi(stderr || "")
      .replace(/\r/g, "")
      .split("\n")
      .filter(
        (line) =>
          !/^\s*(Compiling|Finished|Running|Blocking|Waiting|Fresh|Doc-tests)\b/.test(
            line,
          ),
      )
      .join("\n")
      .replace(/^\s*\n+/, "")
      .trim();
  }

  const normalizeOutput = (s) =>
    (s || "")
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .map((line) => line.replace(/\s+$/, ""))
      .join("\n")
      .replace(/^\n+/, "")
      .replace(/\n+$/, "");

  function setStatus(el, state, text) {
    if (!el) return;
    el.className = `pg-status ${state}`;
    el.textContent = text;
  }

  async function executeCode(code, runTests) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);
    try {
      const response = await fetch(PLAYGROUND_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "stable",
          mode: "debug",
          edition: "2021",
          crateType: "bin",
          tests: Boolean(runTests),
          code,
          backtrace: false,
        }),
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(`Playground responded with HTTP ${response.status}`);
      }
      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  function initPlayground(pg) {
    const ta = pg.querySelector(".editor-input");
    const highlight = pg.querySelector(".editor-highlight");
    const highlightCode = highlight && highlight.querySelector("code");
    const output = pg.querySelector(".pg-output");
    const outPre = pg.querySelector(".pg-out");
    const verdict = pg.querySelector(".pg-verdict");
    const warnWrap = pg.querySelector(".pg-warn");
    const warnPre = warnWrap && warnWrap.querySelector("pre");
    const status = pg.querySelector(".pg-status");
    const runBtn = pg.querySelector(".pg-run");
    const runLabel = runBtn && runBtn.querySelector(".run-label");
    const resetBtn = pg.querySelector(".pg-reset");
    const solutionBtn = pg.querySelector(".pg-solution");

    if (!ta || !highlight || !highlightCode || !runBtn) return;

    const expectedEl = pg.querySelector(".pg-expect");
    const expected = expectedEl ? expectedEl.textContent : "";
    const runTests = pg.dataset.tests === "true";
    const initialCode = ta.value;
    const solutionEl = pg.querySelector("script.pg-solution-code");
    const solution = solutionEl ? solutionEl.textContent.trim() : "";

    if (!solution && solutionBtn) solutionBtn.remove();

    const runLabelText = runLabel ? runLabel.textContent : "▶ Run";
    let running = false;

    function sizeEditor() {
      const lines = ta.value.split("\n").length;
      const styles = getComputedStyle(highlight);
      const lineHeight = parseFloat(styles.lineHeight) || 23;
      const padding =
        (parseFloat(styles.paddingTop) || 0) +
        (parseFloat(styles.paddingBottom) || 0);
      const height = Math.min(600, Math.max(150, lines * lineHeight + padding + 8));
      ta.style.height = `${height}px`;
      highlight.style.height = `${height}px`;
    }

    function render() {
      highlightCode.innerHTML = `${highlightRust(ta.value)}\n`;
      sizeEditor();
    }

    function clearVerdict() {
      if (!verdict) return;
      verdict.className = "pg-verdict";
      verdict.textContent = "";
    }

    function resetOutput() {
      if (output) output.hidden = true;
      if (outPre) outPre.textContent = "";
      if (warnWrap) warnWrap.hidden = true;
      if (warnPre) warnPre.textContent = "";
      clearVerdict();
      setStatus(status, "idle", "ready");
    }

    async function run() {
      if (running) return;
      running = true;
      runBtn.disabled = true;
      if (runLabel) runLabel.textContent = "Running…";
      if (output) output.hidden = false;
      if (outPre) outPre.textContent = "";
      if (warnWrap) warnWrap.hidden = true;
      clearVerdict();
      setStatus(status, "running", "compiling & running…");

      try {
        const result = await executeCode(ta.value, runTests);
        const stdout = result.stdout || "";
        const cleaned = cleanCompiler(result.stderr);
        const hasWarnings = Boolean(cleaned);

        if (result.success) {
          if (outPre) outPre.textContent = stdout || "(the program printed nothing)";
          setStatus(
            status,
            "ok",
            runTests ? "tests passed" : result.exitDetail || "exited 0",
          );

          if (hasWarnings && warnWrap && warnPre) {
            warnPre.textContent = cleaned;
            warnWrap.hidden = false;
          }

          if (expected) {
            const matches = normalizeOutput(stdout) === normalizeOutput(expected);
            if (verdict) {
              verdict.className = `pg-verdict show ${matches ? "pass" : "fail"}`;
              verdict.textContent = matches
                ? "✓ Output matches the expected result."
                : "✗ Output does not match yet — compare it with the expected output above.";
            }
          }
        } else {
          const combined = [stdout.trim(), cleaned]
            .filter(Boolean)
            .join("\n\n");
          if (outPre) {
            outPre.textContent =
              combined ||
              "Compilation failed, but the compiler gave no details.";
          }
          setStatus(status, "fail", runTests ? "tests failed" : "compile error");
        }
      } catch (error) {
        if (outPre) {
          outPre.textContent =
            "Could not reach the Rust Playground.\n\n" +
            "The editors need an internet connection. Check your connection and try again, " +
            "or copy the code to https://play.rust-lang.org and run it there.\n\n" +
            `(${error && error.name === "AbortError" ? "request timed out" : error.message})`;
        }
        setStatus(status, "fail", "offline");
      } finally {
        running = false;
        runBtn.disabled = false;
        if (runLabel) runLabel.textContent = runLabelText;
      }
    }

    function insertText(text) {
      ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, "end");
      ta.dispatchEvent(new Event("input", { bubbles: true }));
    }

    ta.addEventListener("input", () => {
      render();
      clearVerdict();
      if (status && !status.classList.contains("running")) {
        // Output stays visible, but is explicitly marked as stale.
        if (output && !output.hidden) setStatus(status, "idle", "code changed");
      }
    });

    ta.addEventListener("scroll", () => {
      highlight.scrollTop = ta.scrollTop;
      highlight.scrollLeft = ta.scrollLeft;
    });

    ta.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        if (event.shiftKey) {
          const start = ta.selectionStart;
          const lineStart = ta.value.lastIndexOf("\n", start - 1) + 1;
          const line = ta.value.slice(lineStart, start);
          const remove = Math.min(4, (line.match(/^ +/) || [""])[0].length);
          if (remove > 0) {
            ta.setSelectionRange(lineStart, lineStart + remove);
            ta.setRangeText("", lineStart, lineStart + remove, "start");
            ta.dispatchEvent(new Event("input", { bubbles: true }));
          }
        } else {
          insertText("    ");
        }
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        run();
        return;
      }

      if (event.key === "Enter" && !event.shiftKey) {
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        if (start !== end) return;
        const lineStart = ta.value.lastIndexOf("\n", start - 1) + 1;
        const line = ta.value.slice(lineStart, start);
        const indent = (line.match(/^[ \t]*/) || [""])[0];
        const extra = /[{\[(]\s*$/.test(line) ? "    " : "";
        event.preventDefault();
        insertText(`\n${indent}${extra}`);
      }
    });

    runBtn.addEventListener("click", run);

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        ta.value = initialCode;
        render();
        resetOutput();
      });
    }

    if (solutionBtn) {
      solutionBtn.addEventListener("click", () => {
        ta.value = solution;
        render();
        resetOutput();
        setStatus(status, "idle", "solution loaded");
        ta.focus();
      });
    }

    window.addEventListener("resize", sizeEditor);
    render();
  }

  /* ------------------------------------------------------------------ *
   * Quizzes
   * ------------------------------------------------------------------ */

  function initQuizzes() {
    const lessonId = document.body.dataset.lesson;

    document.querySelectorAll(".quiz").forEach((quiz) => {
      const questions = Array.from(quiz.querySelectorAll(".quiz-q"));
      const checkBtn = quiz.querySelector(".quiz-check");
      const retryBtn = quiz.querySelector(".quiz-retry");
      const scoreEl = quiz.querySelector(".quiz-score");
      if (!questions.length || !checkBtn) return;

      checkBtn.addEventListener("click", () => {
        let correct = 0;
        let missing = 0;

        questions.forEach((question) => {
          const picked = question.querySelector("input:checked");
          if (!picked) {
            missing += 1;
            return;
          }
          const answer = Number(question.dataset.answer);
          const isCorrect = Number(picked.value) === answer;
          question.classList.add(isCorrect ? "is-correct" : "is-wrong");

          question.querySelectorAll(".opt").forEach((label) => {
            const input = label.querySelector("input");
            const value = Number(input.value);
            label.classList.toggle("correct", value === answer);
            label.classList.toggle(
              "chosen-wrong",
              input === picked && !isCorrect,
            );
          });

          const explain = question.querySelector(".explain");
          if (explain) explain.hidden = false;
          if (isCorrect) correct += 1;
        });

        if (missing) {
          if (scoreEl) {
            scoreEl.className = "quiz-score fail";
            scoreEl.textContent = `Answer all ${questions.length} questions first (${missing} left).`;
          }
          return;
        }

        const total = questions.length;
        const pct = correct / total;
        const passed = pct >= PASS_RATIO;

        if (scoreEl) {
          scoreEl.className = `quiz-score ${passed ? "pass" : "fail"}`;
          scoreEl.innerHTML = `<strong>${correct} / ${total}</strong> correct — ${
            passed
              ? "lesson complete!"
              : "not quite. Read the explanations, then retry."
          }`;
        }

        if (passed) markComplete(lessonId, correct, total);
      });

      if (retryBtn) {
        retryBtn.addEventListener("click", () => {
          questions.forEach((question) => {
            question.classList.remove("is-correct", "is-wrong");
            question.querySelectorAll("input").forEach((input) => {
              input.checked = false;
            });
            question.querySelectorAll(".opt").forEach((label) => {
              label.classList.remove("correct", "chosen-wrong");
            });
            const explain = question.querySelector(".explain");
            if (explain) explain.hidden = true;
          });
          if (scoreEl) {
            scoreEl.className = "quiz-score";
            scoreEl.textContent = "";
          }
        });
      }

      if (lessonId && progress.quizzes[lessonId] && scoreEl) {
        const { score, total } = progress.quizzes[lessonId];
        if (typeof score === "number" && typeof total === "number") {
          scoreEl.className = "quiz-score pass";
          scoreEl.innerHTML = `<strong>${score} / ${total}</strong> correct — you have already completed this lesson.`;
        }
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * Page chrome: mobile nav, reading progress
   * ------------------------------------------------------------------ */

  function initChrome() {
    const menuBtn = document.querySelector(".menu-btn");
    const scrim = document.querySelector(".scrim");
    const sidebar = document.querySelector(".sidebar");

    function closeNav() {
      document.body.classList.remove("nav-open");
      if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    }

    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.addEventListener("click", () => {
        const open = document.body.classList.toggle("nav-open");
        menuBtn.setAttribute("aria-expanded", String(open));
        if (open) {
          const first = sidebar && sidebar.querySelector("a");
          if (first) first.focus({ preventScroll: true });
        }
      });
    }

    if (scrim) scrim.addEventListener("click", closeNav);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });

    document.querySelectorAll(".sidebar a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    const readBar = document.querySelector(".read-progress span");
    if (readBar) {
      let ticking = false;
      const update = () => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const pct = max > 0 ? Math.min(100, (doc.scrollTop / max) * 100) : 0;
        readBar.style.width = `${pct}%`;
        ticking = false;
      };
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      update();
    }
  }

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */

  function init() {
    initCodeBlocks();
    initPlaygrounds();
    initQuizzes();
    initChrome();
    syncChrome();
  }

  function initPlaygrounds() {
    document.querySelectorAll(".playground").forEach(initPlayground);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
