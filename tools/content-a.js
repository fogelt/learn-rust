/* Lessons 01–05 */

const {
  c,
  p,
  h3,
  ul,
  ol,
  table,
  callout,
  codeblock,
  playground,
  task,
} = require("./lib");

module.exports = [
  /* ================================================================== *
   * 01 — Hello, Rust!
   * ================================================================== */
  {
    id: "01",
    lede: "Rust is a compiled language with the speed of C and a compiler that refuses to let you shoot yourself in the foot. Start small: one function, one macro, one running program.",
    read: [
p("Rust is a compiled systems language used everywhere from operating systems and browsers to command-line tools and web services. It promises three things at once: performance, memory safety, and fearless concurrency. The cost is a strict compiler — but that compiler is also the best teacher you will have."),
p("You do not need Rust installed to use this course. Every practice editor sends your code to the official Rust Playground and shows the real compiler output. Still, installing Rust locally is worth it: you can keep experimenting offline and build real projects."),
h3("Install the toolchain"),
p("Rust is installed with " + c("rustup") + ", a small tool that manages the compiler and its versions."),
codeblock(`# macOS, Linux, or WSL
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Windows: download and run rustup-init.exe from https://rustup.rs`, "terminal", "text"),
p("Close and reopen your terminal, then check that both tools are available:"),
codeblock(`rustc --version
cargo --version`, "terminal", "text"),
p("You should see a version number and a host triple. That is it — no IDE, no build system to configure, no runtime to install."),
h3("Your first Cargo project"),
p("Cargo is Rust's build tool and package manager. It creates projects, compiles them, runs tests, and downloads dependencies. Create a new project and run it:"),
codeblock(`cargo new hello_rust
cd hello_rust
cargo run`, "terminal", "text"),
p("Cargo generates a tiny project that already prints " + c("Hello, world!") + ". The layout is deliberately simple:"),
codeblock(`hello_rust/
├── Cargo.toml      # package metadata and dependencies
├── Cargo.lock      # exact dependency versions (generated)
└── src/
    └── main.rs     # the entry point`, "project layout", "text"),
p(c("Cargo.toml") + " is the manifest. " + c("src/main.rs") + " is where a binary crate starts. Build artifacts go into " + c("target/") + ", which you should never commit to version control."),
h3("The smallest real program"),
codeblock(`fn main() {
    // Statements end with a semicolon.
    let greeting = "Hello, world!";
    println!("{greeting}");
}`),
ul(
  "<strong>" + c("fn main()") + "</strong> defines the entry point. When the program starts, this function runs first.",
  "<strong>Braces</strong> " + c("{ ... }") + " form a block. Blocks can contain statements and produce a value.",
  "<strong>" + c("let") + "</strong> creates a binding. Bindings are immutable by default — a rule you will meet properly in the next lesson.",
  "<strong>" + c("//") + "</strong> starts a comment that runs to the end of the line. " + c("/* ... */") + " is a block comment, and " + c("///") + " documents the item below it.",
  "<strong>" + c('println!("{greeting}")') + "</strong> prints a line. The " + c("!") + " means it is a macro, not a function: it expands into extra formatting code at compile time.",
),
p("The braces inside the string are a placeholder that refers to a variable in scope. You can also use positional placeholders:"),
codeblock(`fn main() {
    let name = "Ferris";
    let legs = 10;

    println!("{name} has {legs} legs.");
    println!("{} + {} = {}", 2, 3, 2 + 3);
}`),
p("Macros are everywhere in Rust. " + c("println!") + " adds a newline; " + c("print!") + " does not; " + c("format!") + " returns a " + c("String") + " instead of printing. You will meet many more."),
h3("The commands you will actually use"),
table(
  ["Command", "What it does"],
  [
    [c("cargo new NAME"), "Create a new package in a new directory."],
    [c("cargo run"), "Compile the project and run the binary."],
    [c("cargo build"), "Compile without running. Output lands in " + c("target/debug/") + "."],
    [c("cargo build --release"), "Compile with optimisations. Output lands in " + c("target/release/") + "."],
    [c("cargo check"), "Type-check quickly without producing a binary — great while editing."],
    [c("cargo test"), "Compile and run the test suite."],
  ],
),
callout("tip", "Debug vs release", "Debug builds are fast to compile and slow to run; they also keep overflow checks on. Release builds optimise aggressively and switch overflow checks off. Use " + c("cargo run") + " while learning and " + c("cargo run --release") + " when measuring performance."),
    ].join("\n"),
    practice: [
task({
  body: p(
    "The editor below is a complete Rust program. Change it so it prints exactly these two lines, using two separate " +
      c("println!") +
      " calls:",
  ),
  expect: "Hello, Rust!\nI am ready to learn.",
  hint:
    "Text goes inside double quotes, and every statement ends with a semicolon. Delete the " +
    c('"Hello, world!"') +
    " line or edit it.",
}),
playground({
  starter: `fn main() {
    println!("Hello, world!");
    // TODO: print a second line
}`,
  solution: `fn main() {
    println!("Hello, Rust!");
    println!("I am ready to learn.");
}`,
  expect: "Hello, Rust!\nI am ready to learn.",
}),
    ].join("\n"),
    questions: [
      {
        q: "Which Cargo command compiles your project and then runs the binary?",
        options: [c("cargo run"), c("cargo build"), c("cargo check"), c("cargo test")],
        answer: 0,
        explain:
          c("cargo build") +
          " only compiles. " +
          c("cargo run") +
          " compiles if needed and then executes the binary. " +
          c("cargo check") +
          " type-checks without code generation, and " +
          c("cargo test") +
          " runs tests.",
      },
      {
        q: "What does the " + c("!") + " in " + c("println!") + " mean?",
        options: [
          "It negates the argument, like in C.",
          c("println!") + " is a macro, not a function.",
          "It marks the line as compile-time only.",
          "It prints without adding a newline.",
        ],
        answer: 1,
        explain:
          "The exclamation mark signals a macro call. Macros expand into code during compilation, which is why " +
          c("println!") +
          " can check format strings at compile time.",
      },
      {
        q: "Where does a Cargo binary package put its entry point by default?",
        options: [c("src/lib.rs"), c("main.rs") + " in the project root", c("src/main.rs"), c("src/bin/main.rs")],
        answer: 2,
        explain:
          "A binary crate starts at " +
          c("src/main.rs") +
          ". " +
          c("src/lib.rs") +
          " is the entry point for a library crate, which has no " +
          c("main") +
          ".",
      },
      {
        q: "Which line correctly prints " + c("Hello, Ferris!") + "?",
        options: [
          c('println!("Hello, {}!", "Ferris");'),
          c('println!("Hello, {}!");'),
          c('print("Hello, Ferris!");'),
          c('console.log!("Hello, Ferris!");'),
        ],
        answer: 0,
        explain:
          "Each " +
          c("{}") +
          " placeholder needs a matching argument. The second option supplies none, the third calls a non-existent function without " +
          c("!") +
          ", and the fourth is JavaScript, not Rust.",
      },
    ],
  },

  /* ================================================================== *
   * 02 — Variables, Types & Mutability
   * ================================================================== */
  {
    id: "02",
    lede: "Rust does not let variables change unless you say so. That sounds annoying until you realise how many bugs come from accidental mutation. Here is how bindings, types, and shadowing work.",
    read: [
p("In many languages a variable is a box you can put a new value into whenever you like. In Rust, a binding is a promise: " + c("let x = 5;") + " means " + c("x") + " will stay " + c("5") + " until it goes out of scope. If you want to change it, you ask for permission with " + c("mut") + "."),
h3("Immutable by default"),
codeblock(`fn main() {
    let level = 1;
    println!("Level {level}");

    // level = 2; // error: cannot assign twice to immutable variable
}`),
p("If you uncomment that line, the compiler rejects the program. It does not wait until runtime, and it points at both the declaration and the assignment. To allow reassignment, declare the binding as mutable:"),
codeblock(`fn main() {
    let mut level = 1;
    level = 2;
    level += 1;
    println!("Level {level}"); // Level 3
}`),
p("Mutability is per binding, not per type. Two bindings of the same type can have different permissions."),
h3("Types: inferred, and occasionally written down"),
p("Rust is statically typed, but it usually infers the type from how a value is used. When inference is not enough — or when you want to be explicit — add an annotation after a colon:"),
codeblock(`fn main() {
    let guess: u32 = 42;      // explicitly unsigned 32-bit
    let pi = 3.14;            // f64 by default
    let ready = true;         // bool
    let initial = 'R';        // char
    let title = "Rust";       // &str (a borrowed string slice)
}`),
table(
  ["Type", "What it is", "Default?"],
  [
    [c("i8 / i16 / i32 / i64 / i128"), "Signed integers of increasing width.", c("i32") + " for whole numbers"],
    [c("u8 / u16 / u32 / u64 / u128"), "Unsigned integers (no negative values).", "—"],
    [c("isize / usize"), "Pointer-sized integers; " + c("usize") + " is used for lengths and indexes.", "—"],
    [c("f32 / f64"), "Floating-point numbers following IEEE 754.", c("f64")],
    [c("bool"), "Either " + c("true") + " or " + c("false") + ". Conditions must be bools.", "—"],
    [c("char"), "One Unicode scalar value, written with single quotes: " + c("'🦀'") + ". Four bytes.", "—"],
    [c("String / &str"), "Owned, growable text / borrowed text. Covered in lesson 6.", "—"],
    [c("(T, U)"), "Tuple: a fixed-size group of values of different types.", "—"],
    [c("[T; N]"), "Array: " + c("N") + " values of the same type, fixed at compile time.", "—"],
  ],
),
p("Underscores make long numbers readable: " + c("1_000_000") + ". Rust also has " + c("0xff") + " (hex), " + c("0b1010") + " (binary), and " + c("0o755") + " (octal) literals."),
callout("warn", "Overflow behaves differently per profile", "In a debug build, an integer overflow panics. In a release build it wraps around silently. If overflow is possible, be explicit: " + c("checked_add") + " returns an " + c("Option") + ", " + c("saturating_add") + " clamps at the boundary, and " + c("wrapping_add") + " wraps."),
h3("Shadowing: a new binding with the same name"),
p("You can declare a new variable with the same name using another " + c("let") + ". This is called shadowing. The new binding can even have a different type:"),
codeblock(`fn main() {
    let spaces = "    ";        // &str
    let spaces = spaces.len();  // usize
    println!("{spaces} spaces"); // 4 spaces
}`),
p("Unlike " + c("mut") + ", shadowing creates a brand-new value. The old binding still exists until the end of its scope, but it is inaccessible by name. This is handy for transforming a value step by step without inventing names like " + c("spaces_str") + " and " + c("spaces_count") + "."),
h3("Tuples and arrays"),
p("Tuples group a fixed number of values of different types. Access fields with " + c(".") + " and an index, or destructure them:"),
codeblock(`fn main() {
    let point: (i32, i32) = (3, 7);
    let (x, y) = point;

    println!("x={x} y={y} whole={point:?}");
    println!("first field: {}", point.0);
}`),
p("Arrays hold a fixed number of values of one type. Their length is part of the type, so " + c("[i32; 3]") + " and " + c("[i32; 4]") + " are different types:"),
codeblock(`fn main() {
    let scores: [i32; 5] = [90, 80, 70, 60, 50];

    println!("first={} last={}", scores[0], scores[4]);
    println!("length={}", scores.len());

    // scores[5] would panic: index out of bounds
}`),
p("Indexing with " + c("[]") + " panics if the index is out of range. When the index comes from user input, prefer " + c("get") + ", which returns an " + c("Option") + " (lesson 7)."),
p("If you need a list that grows at runtime, you want a " + c("Vec") + " — that is lesson 6."),
h3("Constants"),
codeblock(`const MAX_PLAYERS: u32 = 8;

fn main() {
    println!("A match allows {MAX_PLAYERS} players.");
}`),
p("Constants are evaluated at compile time, must have an explicit type, and use " + c("SCREAMING_SNAKE_CASE") + " by convention. They can live at module level and are inlined wherever they are used."),
callout("note", "Warnings are not failures", "Unused variables produce warnings, not errors. Prefix a binding with an underscore (" + c("_temp") + ") if you need it to exist but will not read it. Run " + c("cargo build") + " and read the warnings — they often point at real mistakes."),
    ].join("\n"),
    practice: [
task({
  body: p(
    "This program does not compile yet. Make the first binding mutable so the reassignment is allowed, keep the shadowing, and check that the output matches.",
  ),
  expect: "points = 15",
  hint:
    "The compiler says “cannot assign twice to immutable variable”. Add one keyword to the first " +
    c("let") +
    " line.",
}),
playground({
  starter: `fn main() {
    let score = 0;
    score = 10; // TODO: allow this assignment

    let score = score + 5; // shadowing creates a new binding
    let label: &str = "points";

    println!("{label} = {score}");
}`,
  solution: `fn main() {
    let mut score = 0;
    score = 10;

    let score = score + 5;
    let label: &str = "points";

    println!("{label} = {score}");
}`,
  expect: "points = 15",
}),
    ].join("\n"),
    questions: [
      {
        q: "What is the default mutability of a binding created with " + c("let") + "?",
        options: ["Immutable", "Mutable", "Depends on the type", "Depends on the value"],
        answer: 0,
        explain:
          "Bindings are immutable unless declared with " +
          c("mut") +
          ". The compiler rejects reassignment, which rules out a large class of accidental-state bugs.",
      },
      {
        q: "Which declaration allows " + c("count = count + 1;") + " later in the same scope?",
        options: [
          c("let count = 0;"),
          c("let mut count = 0;"),
          c("const count = 0;"),
          c("let count: mut i32 = 0;"),
        ],
        answer: 1,
        explain:
          "Only " +
          c("let mut") +
          " creates a mutable binding. A " +
          c("const") +
          " is always immutable, and " +
          c("let count: mut i32") +
          " is not valid syntax — " +
          c("mut") +
          " comes before the name.",
      },
      {
        q: "What does this do? " + c('let x = 5; let x = "five";'),
        options: [
          "Fails: a variable cannot change type.",
          "Creates a new binding that shadows the old one and may have a different type.",
          "Changes the type of the original binding in place.",
          "Creates two mutable variables with the same name.",
        ],
        answer: 1,
        explain:
          "The second " +
          c("let") +
          " introduces a new binding. Shadowing is not mutation: the old value still exists until the end of scope, but the name now refers to the new binding, which can have a different type.",
      },
      {
        q: "Which literal is a " + c("char") + "?",
        options: ['"a"', "'a'", c("char('a')"), 'b"a"'],
        answer: 1,
        explain:
          "Single quotes create a " +
          c("char") +
          " (one Unicode scalar value). Double quotes create a string slice (" +
          c("&str") +
          "), and " +
          c('b"a"') +
          " is a byte-string literal.",
      },
    ],
  },

  /* ================================================================== *
   * 03 — Functions & Control Flow
   * ================================================================== */
  {
    id: "03",
    lede: "Functions are the building blocks, and in Rust almost everything is an expression — including if and blocks. That one idea makes return values feel natural.",
    read: [
p("Functions are declared with " + c("fn") + ", take typed parameters, and optionally declare a return type with " + c("->") + ". Rust does not care about declaration order: a function can call one defined below it."),
codeblock(`fn main() {
    let result = add(2, 3);
    greet("Ferris");

    println!("2 + 3 = {result}");
    println!("double(4) = {}", double(4));
}

fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn double(n: i32) -> i32 {
    n * 2
}

fn greet(name: &str) {
    println!("Hello, {name}!");
}`),
p("Notice that " + c("add") + " has no " + c("return") + " keyword. The last expression in a function body is its value, as long as it has no semicolon. Add a semicolon and you turn the expression into a statement that produces " + c("()") + " — the compiler will complain that the types do not match."),
codeblock(`fn absolute(n: i32) -> i32 {
    if n < 0 {
        return -n; // early return is still available
    }
    n // tail expression: this is the result
}`),
h3("Statements, expressions, and blocks"),
p("A statement performs an action; an expression produces a value. Blocks are expressions, so you can initialise a binding from one:"),
codeblock(`fn main() {
    let y = {
        let x = 3;
        x * x
    };

    println!("{y}"); // 9
}`),
p("The inner " + c("x") + " goes out of scope at the closing brace, while the block's final expression becomes the value of " + c("y") + "."),
h3("if is an expression"),
codeblock(`fn main() {
    let n = 7;

    if n % 2 == 0 {
        println!("even");
    } else {
        println!("odd");
    }

    let label = if n > 5 { "big" } else { "small" };
    println!("{label}");
}`),
ul(
  "The condition must be a " + c("bool") + ". Rust will not treat " + c("0") + ", " + c('""') + ", or " + c("null") + " as false.",
  "Braces are mandatory, even for a single statement. No dangling-else surprises.",
  "When " + c("if") + " is used as an expression, every branch must produce the same type.",
),
callout("note", "No truthiness", "Coming from JavaScript or Python, this feels verbose at first. It also means " + c("if user_input") + " is a compile error rather than a bug that appears only when the value is empty."),
h3("Loops: loop, while, and for"),
codeblock(`fn main() {
    let mut countdown = 3;
    while countdown > 0 {
        println!("{countdown}");
        countdown -= 1;
    }

    for i in 1..=3 {
        println!("i = {i}");
    }

    let names = ["Ada", "Linus", "Ferris"];
    for name in names {
        println!("Hello, {name}");
    }

    let mut n = 0;
    let first_square_over_50 = loop {
        n += 1;
        if n * n > 50 {
            break n * n;
        }
    };
    println!("{first_square_over_50}"); // 64
}`),
ul(
  c("loop") + " repeats forever until a " + c("break") + ". A " + c("break value;") + " makes the loop itself evaluate to that value.",
  c("while") + " repeats while a condition is true.",
  c("for") + " walks an iterator: a range, an array, a vector, or anything else that implements " + c("IntoIterator") + ". Prefer " + c("for") + " when the number of items is known.",
),
p("Ranges are half-open by default: " + c("0..5") + " yields 0, 1, 2, 3, 4. Use " + c("0..=5") + " to include 5. You can label loops when you need to break out of an outer one:"),
codeblock(`'outer: for x in 0..3 {
    for y in 0..3 {
        if x == 1 && y == 1 {
            break 'outer;
        }
    }
}`),
p("Rust also has " + c("continue") + " to skip to the next iteration, and " + c("for") + " loops are usually faster than hand-written index loops because the compiler knows exactly what is being iterated."),
callout("tip", "Reading compiler errors", "When a function returns the wrong type, read the “expected … found …” pair at the end of the error. Nine times out of ten, a stray semicolon is the culprit. Lesson 7 covers " + c("Result") + " for errors you can recover from; this lesson is about the shape of code, not failure handling."),
    ].join("\n"),
    practice: [
task({
  body: p(
    "Complete " +
      c("sum_to") +
      " so it returns the sum of every integer from 1 through " +
      c("n") +
      " (inclusive). Use a " +
      c("for") +
      " loop and a mutable accumulator.",
  ),
  expect: "sum = 55",
  hint:
    c("for i in 1..=n { total += i; }") +
    " — the " +
    c("..=") +
    " includes " +
    c("n") +
    ". Remember that the final " +
    c("total") +
    " must not end with a semicolon.",
}),
playground({
  starter: `fn sum_to(n: u32) -> u32 {
    let mut total = 0;

    // TODO: add every number from 1 through n (inclusive)

    total
}

fn main() {
    println!("sum = {}", sum_to(10));
}`,
  solution: `fn sum_to(n: u32) -> u32 {
    let mut total = 0;

    for i in 1..=n {
        total += i;
    }

    total
}

fn main() {
    println!("sum = {}", sum_to(10));
}`,
  expect: "sum = 55",
}),
    ].join("\n"),
    questions: [
      {
        q: "Which function signature correctly returns an " + c("i32") + "?",
        options: [
          c("fn f() -> i32 { 5 }"),
          c("fn f() -> i32 { 5; }"),
          c("fn f() : i32 { 5 }"),
          c("fn f() => i32 { 5 }"),
        ],
        answer: 0,
        explain:
          "The arrow is " +
          c("->") +
          ", and the tail expression " +
          c("5") +
          " produces the return value. With a semicolon, the block produces " +
          c("()") +
          ", which does not match " +
          c("i32") +
          ".",
      },
      {
        q: "What is the value of this block? " + c("{ let x = 4; x * 2 }"),
        options: ["8", "4", c("()"), "It does not compile"],
        answer: 0,
        explain:
          "The block's final expression has no semicolon, so it evaluates to " +
          c("8") +
          ". Blocks are expressions in Rust.",
      },
      {
        q: "Which condition is valid in an " + c("if") + " expression?",
        options: [c("if count { ... }"), c("if count == 0 { ... }"), c("if count = 0 { ... }"), c("if 0 { ... }")],
        answer: 1,
        explain:
          "Rust conditions must be " +
          c("bool") +
          ". There is no implicit conversion from numbers, and " +
          c("=") +
          " is assignment, not comparison — use " +
          c("==") +
          ".",
      },
      {
        q: "What does " + c("for i in 0..3") + " iterate over?",
        options: ["0, 1, 2, 3", "0, 1, 2", "1, 2, 3", "0, 3"],
        answer: 1,
        explain:
          c("0..3") +
          " is a half-open range: it starts at 0 and stops before 3. Use " +
          c("0..=3") +
          " to include the upper bound.",
      },
    ],
  },

  /* ================================================================== *
   * 04 — Ownership & Borrowing
   * ================================================================== */
  {
    id: "04",
    lede: "Ownership is the idea that makes Rust different. One value has one owner; borrowing lets other code look without taking it. Learn the rules once and the borrow checker becomes an ally.",
    read: [
p("Most languages manage memory with a garbage collector or by making you call " + c("free") + ". Rust uses a third approach: the compiler tracks which part of your code owns each value, and inserts the cleanup automatically at the right moment. The rules are simple — enforcing them is the clever part."),
h3("The three ownership rules"),
ol(
  "Every value has exactly one owner.",
  "There can only be one owner at a time.",
  "When the owner goes out of scope, the value is dropped (its memory is freed).",
),
codeblock(`fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // ownership moves from s1 to s2

    println!("{s2}");

    // println!("{s1}"); // error[E0382]: borrow of moved value: s1
}`),
p("A " + c("String") + " is a small struct on the stack — pointer, length, capacity — pointing at bytes on the heap. Assignment does not copy the heap bytes; it moves the pointer. Rust then invalidates " + c("s1") + ". If both names stayed usable, both would free the same allocation at the end of scope: a double free. The compiler forbids it."),
p("Types that live entirely on the stack and are cheap to copy implement the " + c("Copy") + " trait. For them, assignment copies instead of moving:"),
codeblock(`fn main() {
    let x = 5;
    let y = x;

    println!("{x} and {y}"); // both are valid
}`),
p("Integers, floats, " + c("bool") + ", " + c("char") + ", and tuples or arrays made entirely of " + c("Copy") + " types are " + c("Copy") + ". " + c("String") + ", " + c("Vec") + ", and " + c("HashMap") + " are not."),
p("If you genuinely need two independent heap values, clone explicitly:"),
codeblock(`let s1 = String::from("hello");
let s2 = s1.clone();
println!("{s1} {s2}"); // both valid`),
p(c("clone") + " can be expensive. Reaching for it to silence the borrow checker is usually a design smell; borrowing is normally what you want."),
h3("Moving into functions"),
codeblock(`fn consume(message: String) {
    println!("{message}");
}

fn main() {
    let msg = String::from("hello");
    consume(msg); // msg is moved into the function

    // println!("{msg}"); // error: value borrowed here after move
}`),
p("Passing a " + c("String") + " by value transfers ownership. The function drops it when it returns. To let the caller keep the value, pass a reference instead."),
h3("Borrowing with references"),
codeblock(`fn length(text: &str) -> usize {
    text.len()
}

fn main() {
    let message = String::from("hello");
    let len = length(&message); // borrow, do not move

    println!("{message} has {len} bytes");
}`),
p("The " + c("&") + " creates a reference. The function reads through it but does not own the " + c("String") + ", so " + c("message") + " is still usable afterwards. Here " + c("&String") + " is automatically coerced to " + c("&str") + " — a more flexible borrowed string type."),
p("Immutable references can be shared freely:"),
codeblock(`let message = String::from("hello");
let a = &message;
let b = &message;

println!("{a} {b}"); // fine: many readers`),
p("If a function needs to change the value, borrow it mutably. The binding itself must be " + c("mut") + " too:"),
codeblock(`fn add_suffix(text: &mut String) {
    text.push_str("!");
}

fn main() {
    let mut message = String::from("hello");
    add_suffix(&mut message);
    println!("{message}"); // hello!
}`),
h3("The borrowing rules"),
callout("warn", "One rule to remember", "At any given time, you can have either <strong>any number of immutable references</strong> (" + c("&T") + ") <strong>or exactly one mutable reference</strong> (" + c("&mut T") + ") — never both. Every reference must always be valid."),
p("Why so strict? A mutable reference is exclusive access, and immutable references are shared access. Allowing both at once would let one part of your code change a value while another is reading it — the classic data race. Rust moves that bug from runtime to compile time."),
p("Borrows end at their last use, not at the end of the block. Thanks to this non-lexical lifetime analysis, sequential borrows are fine:"),
codeblock(`let mut text = String::from("hi");

let first = &text;
println!("{first}"); // last use of first

text.push_str("!");  // okay: the immutable borrow has ended`),
p("Rust also prevents dangling references. You cannot return a reference to a local value that is about to be dropped; the compiler will reject it. Lesson 8 shows how lifetime annotations describe these relationships when the compiler needs help."),
h3("Slices: borrowing part of a collection"),
codeblock(`fn main() {
    let text = String::from("hello world");
    let hello = &text[0..5];
    let world = &text[6..11];

    println!("{hello} / {world}");

    let numbers = [1, 2, 3, 4, 5];
    let middle = &numbers[1..4];
    println!("{middle:?}"); // [2, 3, 4]
}`),
p("A string slice (" + c("&str") + ") points into an existing string and carries a length. An array slice (" + c("&[T]") + ") works the same way. Slicing by byte index can panic if the index is not on a character boundary — more on that in lesson 6."),
callout("tip", "How to stop fighting the borrow checker", "When a value is moved and you still need it, first ask: does this function really need to own it? Change the parameter to " + c("&T") + " or " + c("&mut T") + ". Reach for " + c("clone()") + " only when you truly need an independent copy."),
    ].join("\n"),
    practice: [
task({
  body: p(
    "This program tries to use " +
      c("greeting") +
      " after moving it into " +
      c("moved") +
      ". Fix it without calling " +
      c(".clone()") +
      ": borrow the string with " +
      c("&") +
      " so both lines can print.",
  ),
  expect: "Hello, Rust\nHello, Rust",
  hint:
    "Change " +
    c("let moved = greeting;") +
    " to " +
    c("let moved = &greeting;") +
    ". Now " +
    c("moved") +
    " is a reference, and ownership never leaves " +
    c("greeting") +
    ".",
}),
playground({
  starter: `fn main() {
    let greeting = String::from("Hello, Rust");
    let moved = greeting;

    // TODO: borrow instead of moving, then keep both prints
    println!("{greeting}");
    println!("{moved}");
}`,
  solution: `fn main() {
    let greeting = String::from("Hello, Rust");
    let borrowed = &greeting;

    println!("{greeting}");
    println!("{borrowed}");
}`,
  expect: "Hello, Rust\nHello, Rust",
}),
    ].join("\n"),
    questions: [
      {
        q: "After " + c("let b = a;") + " where " + c("a") + " is a " + c("String") + ", what happens to " + c("a") + "?",
        options: [
          "It is cloned automatically.",
          "It is moved: " + c("a") + " can no longer be used.",
          "It becomes a reference to " + c("b") + ".",
          "Nothing — both names own the same heap data.",
        ],
        answer: 1,
        explain:
          "Assignment moves ownership for non-" +
          c("Copy") +
          " types. Using " +
          c("a") +
          " afterwards is a compile error. To keep both usable, borrow with " +
          c("&a") +
          " or clone explicitly.",
      },
      {
        q: "Which combination of references is allowed at the same time?",
        options: [
          "Two " + c("&mut T") + " references",
          "One " + c("&mut T") + " and one " + c("&T") + " to the same value",
          "Any number of " + c("&T") + " references",
          "No references at all",
        ],
        answer: 2,
        explain:
          "Many readers or exactly one writer, never both. Immutable references (" +
          c("&T") +
          ") can be shared freely because nobody can change the value through them.",
      },
      {
        q: "How can a function read a " + c("String") + " without taking ownership?",
        options: [
          "Accept it by value: " + c("fn f(s: String)"),
          "Accept a reference: " + c("fn f(s: &str)") + " and call " + c("f(&s)"),
          "Return it immediately",
          "Mark the parameter " + c("mut"),
        ],
        answer: 1,
        explain:
          "Borrowing with " +
          c("&str") +
          " (or " +
          c("&String") +
          ") lets the caller keep ownership. Passing by value moves the string into the function, and it is dropped when the function returns.",
      },
      {
        q: "What does the borrow checker guarantee?",
        options: [
          "That your program never panics.",
          "That references never outlive the data they point to, and that aliasing rules hold.",
          "That your program never allocates on the heap.",
          "That all data races are detected at runtime.",
        ],
        answer: 1,
        explain:
          "Ownership and borrowing are checked at compile time. They rule out use-after-free and data races, but they do not prevent panics from explicit " +
          c("panic!") +
          " calls or out-of-bounds indexing.",
      },
    ],
  },

  /* ================================================================== *
   * 05 — Structs, Enums & Matching
   * ================================================================== */
  {
    id: "05",
    lede: "Structs group related data; enums describe alternatives. Together with match they let you model a problem so precisely that whole categories of bugs become impossible to express.",
    read: [
p("A struct is a named record: several values bundled together. An enum is a choice between variants, and each variant can carry its own data. Both can have methods. " + c("match") + " then forces you to handle every case."),
h3("Defining and creating structs"),
codeblock(`struct User {
    username: String,
    email: String,
    active: bool,
    sign_in_count: u64,
}

fn main() {
    let user = User {
        username: String::from("ferris"),
        email: String::from("ferris@example.com"),
        active: true,
        sign_in_count: 1,
    };

    println!("{} is active: {}", user.username, user.active);
}`),
p("To modify a field, the whole binding must be mutable: " + c("let mut user = ...") + ". Rust does not allow individual fields to be declared mutable."),
p("When a variable has the same name as a field, field-init shorthand saves noise. The " + c("..") + " update syntax fills the remaining fields from another value:"),
codeblock(`fn build_user(username: String, email: String) -> User {
    User {
        username, // shorthand for username: username
        email,
        active: true,
        sign_in_count: 0,
    }
}

let updated = User {
    email: String::from("new@example.com"),
    ..user
};`),
p("Tuple structs are structs without field names. They are handy for wrapping a single value and giving it a distinct type:"),
codeblock(`struct Meters(f64);

fn main() {
    let distance = Meters(42.0);
    println!("{} metres", distance.0);
}`),
h3("Methods and associated functions"),
codeblock(`struct Rectangle {
    width: f64,
    height: f64,
}

impl Rectangle {
    // Associated function: no self, called as Rectangle::new(...)
    fn new(width: f64, height: f64) -> Self {
        Self { width, height }
    }

    // Method: borrows the instance immutably
    fn area(&self) -> f64 {
        self.width * self.height
    }

    // Method that mutates the instance
    fn scale(&mut self, factor: f64) {
        self.width *= factor;
        self.height *= factor;
    }
}

fn main() {
    let mut rect = Rectangle::new(3.0, 4.0);
    println!("area: {}", rect.area());
    rect.scale(2.0);
    println!("area: {}", rect.area());
}`),
ul(
  c("&self") + " borrows the value and cannot mutate it; use it for read-only methods.",
  c("&mut self") + " borrows mutably; the caller needs a mutable binding.",
  c("self") + " takes ownership — useful for builder-style transformations, but the caller loses the original value.",
  c("Self") + " is an alias for the type the " + c("impl") + " block belongs to.",
),
p("You can implement multiple " + c("impl") + " blocks for the same type. Common traits are usually derived instead of written by hand:"),
codeblock(`#[derive(Debug, Clone, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 3, y: 7 };
    let copy = p.clone();

    println!("{p:?}");       // Point { x: 3, y: 7 }
    println!("{p:#?}");      // pretty-printed, one field per line
    println!("equal: {}", p == copy);
}`),
p("Without " + c("#[derive(Debug)]") + ", " + c("{:?}") + " will not compile. Deriving is opt-in: you only get what you ask for."),
h3("Enums with data"),
p("Unlike C-style enums, Rust variants can carry data. This makes enums ideal for representing messages, states, and shapes:"),
codeblock(`#[derive(Debug)]
enum Shape {
    Circle(f64),
    Rectangle { width: f64, height: f64 },
    Triangle { base: f64, height: f64 },
}

fn area(shape: &Shape) -> f64 {
    match shape {
        Shape::Circle(radius) => 3.14159 * radius * radius,
        Shape::Rectangle { width, height } => width * height,
        Shape::Triangle { base, height } => 0.5 * base * height,
    }
}

fn main() {
    let shapes = [
        Shape::Circle(1.0),
        Shape::Rectangle { width: 2.0, height: 3.0 },
        Shape::Triangle { base: 4.0, height: 2.0 },
    ];

    for shape in &shapes {
        println!("{:?} -> {:.2}", shape, area(shape));
    }
}`),
p(c("match") + " takes a value, compares it against patterns, and binds the data inside each variant. It must be exhaustive: every variant has to be covered, or you need a " + c("_") + " catch-all. The compiler checks this for you."),
codeblock(`fn describe(n: i32) -> &'static str {
    match n {
        0 => "zero",
        1..=9 => "single digit",
        n if n < 0 => "negative",
        _ => "large",
    }
}`),
p("Patterns can match literals, ranges, tuples, structs, and enum variants. Guards (" + c("n if n < 0") + ") add a condition. Use " + c("|") + " for alternatives: " + c("1 | 2 | 3") + "."),
h3("Option: Rust's answer to null"),
p("The standard library defines " + c("Option<T>") + " as an enum with two variants: " + c("Some(T)") + " and " + c("None") + ". A value is either present or absent, and the type system makes you handle both cases:"),
codeblock(`fn index_of(haystack: &[&str], needle: &str) -> Option<usize> {
    haystack.iter().position(|item| *item == needle)
}

fn main() {
    let fruits = ["apple", "pear", "plum"];

    match index_of(&fruits, "pear") {
        Some(index) => println!("pear is at {index}"),
        None => println!("not found"),
    }

    if let Some(index) = index_of(&fruits, "plum") {
        println!("plum is at {index}");
    }
}`),
p(c("if let") + " is shorthand for a " + c("match") + " with one interesting arm. " + c("while let") + " does the same in a loop. There is no null in Rust, so there is no null pointer to accidentally dereference."),
callout("tip", "Model the states, not the flags", "Instead of a struct with " + c("is_loading") + ", " + c("has_error") + ", and " + c("data") + " fields that can contradict each other, use an enum with " + c("Loading") + ", " + c("Failed(Error)") + ", and " + c("Ready(Data)") + " variants. Then impossible states cannot be constructed."),
    ].join("\n"),
    practice: [
task({
  body: p(
    "The traffic light enum compiles only when the " +
      c("match") +
      " is exhaustive. Add the missing " +
      c("Yellow") +
      " and " +
      c("Green") +
      " arms so the program runs and prints each action.",
  ),
  expect: "Red: stop\nYellow: slow down\nGreen: go",
  hint:
    "Each arm looks like " +
    c('TrafficLight::Yellow => "slow down",') +
    ". The match arms are separated by commas.",
}),
playground({
  starter: `#[derive(Debug)]
enum TrafficLight {
    Red,
    Yellow,
    Green,
}

impl TrafficLight {
    fn action(&self) -> &str {
        match self {
            TrafficLight::Red => "stop",
            // TODO: handle Yellow and Green
        }
    }
}

fn main() {
    let lights = [TrafficLight::Red, TrafficLight::Yellow, TrafficLight::Green];

    for light in lights {
        println!("{:?}: {}", light, light.action());
    }
}`,
  solution: `#[derive(Debug)]
enum TrafficLight {
    Red,
    Yellow,
    Green,
}

impl TrafficLight {
    fn action(&self) -> &str {
        match self {
            TrafficLight::Red => "stop",
            TrafficLight::Yellow => "slow down",
            TrafficLight::Green => "go",
        }
    }
}

fn main() {
    let lights = [TrafficLight::Red, TrafficLight::Yellow, TrafficLight::Green];

    for light in lights {
        println!("{:?}: {}", light, light.action());
    }
}`,
  expect: "Red: stop\nYellow: slow down\nGreen: go",
}),
    ].join("\n"),
    questions: [
      {
        q: "What does a method taking " + c("&self") + " allow?",
        options: [
          "Reading the instance and calling other read-only methods.",
          "Changing any field of the instance.",
          "Taking ownership and consuming the instance.",
          "Accessing only static fields.",
        ],
        answer: 0,
        explain:
          c("&self") +
          " is an immutable borrow. To mutate fields, the method needs " +
          c("&mut self") +
          " and the instance must be a mutable binding. " +
          c("self") +
          " by value takes ownership.",
      },
      {
        q: "What must a " + c("match") + " expression do?",
        options: [
          "Return a " + c("String") + ".",
          "Cover every possible variant, or include a " + c("_") + " arm.",
          "Contain at least three arms.",
          "Use only integer patterns.",
        ],
        answer: 1,
        explain:
          "Exhaustiveness is enforced at compile time. It is what makes " +
          c("match") +
          " safe when a new enum variant is added later: every use site fails to compile until it handles the new case.",
      },
      {
        q: "Which pair are the variants of " + c("Option<T>") + "?",
        options: [c("Ok(T)") + " and " + c("Err(E)"), c("Some(T)") + " and " + c("None"), c("True") + " and " + c("False"), c("Value(T)") + " and " + c("Null")],
        answer: 1,
        explain:
          c("Option") +
          " models absence with " +
          c("Some") +
          " and " +
          c("None") +
          ". " +
          c("Ok") +
          " and " +
          c("Err") +
          " belong to " +
          c("Result") +
          ", which models success and failure (lesson 7).",
      },
      {
        q: "What does " + c("#[derive(Debug)]") + " enable?",
        options: [
          "Printing the type with " + c("{:?}") + " and " + c("{:#?}") + ".",
          "Comparing two values with " + c("==") + ".",
          "Cloning the value with " + c(".clone()") + ".",
          "Converting the value to JSON.",
        ],
        answer: 0,
        explain:
          c("Debug") +
          " provides the developer-facing formatting used by " +
          c("{:?}") +
          ". Equality needs " +
          c("PartialEq") +
          ", cloning needs " +
          c("Clone") +
          ", and JSON is handled by external crates such as " +
          c("serde") +
          ".",
      },
    ],
  },
];
