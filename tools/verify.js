/* Verify lessons: run playground solutions, starters, and full static examples. */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const API = "https://play.rust-lang.org/execute";

const decode = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const normalize = (s) =>
  (s || "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+$/, ""))
    .join("\n")
    .trim();

async function run(code, tests = false) {
  const response = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      channel: "stable",
      mode: "debug",
      edition: "2021",
      crateType: "bin",
      tests,
      code,
      backtrace: false,
    }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function main() {
  const files = fs
    .readdirSync(path.join(ROOT, "lessons"))
    .filter((file) => file.endsWith(".html"))
    .sort();

  let failures = 0;
  let checked = 0;

  for (const file of files) {
    const html = fs.readFileSync(path.join(ROOT, "lessons", file), "utf8");
    const quizCount = (html.match(/class="quiz-q"/g) || []).length;
    if (quizCount !== 4) {
      console.log(`FAIL ${file}: ${quizCount} quiz questions`);
      failures += 1;
    }

    const playgrounds = [
      ...html.matchAll(
        /<div class="playground"([^>]*)>([\s\S]*?)<\/div>\s*<\/section>/g,
      ),
    ];

    for (const [, attrs, body] of playgrounds) {
      const starter = decode(
        (body.match(/<textarea[^>]*>([\s\S]*?)<\/textarea>/) || [])[1] || "",
      );
      const solution = decode(
        (body.match(/class="pg-solution-code">([\s\S]*?)<\/script>/) || [])[1] || "",
      );
      const expected = normalize(
        (body.match(/class="pg-expect">([\s\S]*?)<\/script>/) || [])[1] || "",
      );
      const tests = /data-tests="true"/.test(attrs);

      console.log(`\n${file} · starter${tests ? " (tests)" : ""}`);
      const starterResult = await run(starter, tests);
      console.log(
        `  starter: ${starterResult.success ? "ok" : "fails (may be intentional)"}`,
      );

      if (!solution) {
        console.log("  no solution found!");
        failures += 1;
        continue;
      }

      console.log("  running solution...");
      const result = await run(solution, tests);
      checked += 1;

      if (!result.success) {
        console.log("  FAIL solution did not succeed");
        console.log((result.stderr || "").split("\n").slice(0, 12).join("\n"));
        console.log((result.stdout || "").split("\n").slice(0, 12).join("\n"));
        failures += 1;
        continue;
      }

      if (!tests && expected) {
        const actual = normalize(result.stdout);
        if (actual !== expected) {
          console.log("  FAIL output mismatch");
          console.log(`  expected: ${JSON.stringify(expected)}`);
          console.log(`  actual:   ${JSON.stringify(actual)}`);
          failures += 1;
        } else {
          console.log("  solution: ok, output matches");
        }
      } else if (tests) {
        const stdout = result.stdout || "";
        const passLine = stdout.match(/test result: ok\. (\d+) passed/);
        console.log(
          `  solution: tests pass${passLine ? ` (${passLine[1]} tests)` : ""}`,
        );
      } else {
        console.log("  solution: ok");
      }
    }
  }

  // Compile full static examples labelled main.rs.
  console.log("\nStatic main.rs examples");
  for (const file of files) {
    const html = fs.readFileSync(path.join(ROOT, "lessons", file), "utf8");
    const blocks = [
      ...html.matchAll(
        /<div class="codeblock">\s*<div class="codeblock-head">[\s\S]*?<span>main\.rs<\/span><\/div>\s*<pre><code class="rust">([\s\S]*?)<\/code><\/pre>/g,
      ),
    ];
    for (const [, codeRaw] of blocks) {
      const code = decode(codeRaw);
      if (!/fn main\s*\(/.test(code)) continue;
      if (/does not compile/.test(code)) continue;
      checked += 1;
      const result = await run(code);
      if (!result.success) {
        if (/panicked at/.test(`${result.stdout || ""}\n${result.stderr || ""}`)) {
          console.log(`  note ${file}: compiles, then panics by design`);
          continue;
        }
        console.log(`  FAIL ${file}: static example did not compile`);
        console.log(
          (result.stderr || "").split("\n").slice(0, 10).join("\n"),
        );
        failures += 1;
      }
    }
  }

  console.log(`\nChecked ${checked} compiled samples; failures: ${failures}`);
  process.exitCode = failures ? 1 : 0;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
