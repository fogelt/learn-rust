/* Build the static course: index.html + one page per lesson. */

const fs = require("fs");
const path = require("path");
const { LESSONS, renderLesson, renderIndex } = require("./lib");

const ROOT = path.resolve(__dirname, "..");
const LESSONS_DIR = path.join(ROOT, "lessons");

const contents = [...require("./content-a"), ...require("./content-b")];

function validate(lesson, content) {
  if (!content) throw new Error(`Missing content for lesson ${lesson.id}`);
  if (!content.lede || !content.read || !content.practice) {
    throw new Error(`Lesson ${lesson.id} is missing a section`);
  }
  if (!Array.isArray(content.questions) || content.questions.length !== 4) {
    throw new Error(`Lesson ${lesson.id} must have exactly 4 questions`);
  }
  content.questions.forEach((question, index) => {
    if (
      typeof question.answer !== "number" ||
      question.answer < 0 ||
      question.answer >= question.options.length
    ) {
      throw new Error(`Lesson ${lesson.id}, question ${index + 1} has a bad answer`);
    }
  });
}

fs.mkdirSync(LESSONS_DIR, { recursive: true });

for (const lesson of LESSONS) {
  const content = contents.find((item) => item.id === lesson.id);
  validate(lesson, content);
  const file = path.join(LESSONS_DIR, `${lesson.id}-${lesson.slug}.html`);
  fs.writeFileSync(file, renderLesson(lesson, content), "utf8");
  console.log(`wrote ${path.relative(ROOT, file)}`);
}

fs.writeFileSync(path.join(ROOT, "index.html"), renderIndex(), "utf8");
console.log("wrote index.html");
