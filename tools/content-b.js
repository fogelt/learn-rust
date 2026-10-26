/* Lessons 06–10 */

const {
  c,
  p,
  h3,
  ul,
  table,
  callout,
  codeblock,
  playground,
  task,
} = require("./lib");

module.exports = [
  /* ================================================================== *
   * 06 — Vec, String & HashMap
   * ================================================================== */
  {
    id: "06",
    lede: "Real programs need data that grows. Vectors hold lists, Strings hold text, and hash maps answer “what is the value for this key?” — all three own their contents on the heap.",
    read: [
p("Arrays have a fixed length known at compile time. A " + c("Vec<T>") + " is a growable array on the heap: it owns its elements, tracks its length and capacity, and reallocates as needed. This is the list type you will reach for most often."),
h3("Vectors"),
codeblock(`fn main() {
    let mut scores = vec![90, 80, 70];

    scores.push(60);
    scores[0] = 95;

    println!("{:?}", scores);          // [95, 80, 70, 60]
    println!("len = {}", scores.len());
    println!("first = {}", scores[0]);

    match scores.get(10) {
        Some(score) => println!("score at 10: {score}"),
        None => println!("no score at index 10"),
    }
}`),
ul(
  c("vec![...]") + " builds a vector from a list of values; " + c("Vec::new()") + " starts empty and usually needs a type annotation.",
  c("push") + " appends, " + c("pop") + " removes and returns the last element as an " + c("Option<T>") + ".",
  c("scores[0]") + " panics on an invalid index; " + c("get(0)") + " returns " + c("Option<&T>") + " and is the safe choice for untrusted indexes.",
  c("for score in &scores") + " iterates by reference; " + c("for score in &mut scores") + " iterates mutably; " + c("for score in scores") + " consumes the vector and yields owned values.",
),
codeblock(`fn main() {
    let mut numbers = vec![3, 1, 4, 1, 5];

    for number in &mut numbers {
        *number += 10; // dereference the mutable borrow
    }

    numbers.sort();
    numbers.dedup();

    println!("{numbers:?}"); // [11, 13, 14, 15]
}`),
p("Vectors must contain a single type. If you need mixed types, use an enum with one variant per type — the same trick works for JSON-like data, as you will see with " + c("serde") + " later."),
h3("Strings: String vs &str"),
p("Rust has two string types that are easy to confuse. A " + c("&str") + " is a borrowed view into UTF-8 text — a pointer and a length. A " + c("String") + " owns a growable, heap-allocated buffer. String literals are " + c("&'static str") + ": they live in the binary for the whole program."),
codeblock(`fn main() {
    let mut greeting = String::from("hello");
    greeting.push_str(", world");
    greeting.push('!');

    println!("{greeting}");
    println!("chars = {}", greeting.chars().count());
    println!("bytes = {}", greeting.len());
}`),
table(
  ["Operation", "Notes"],
  [
    [c("String::from(s)") + ", " + c("s.to_string()"), "Create an owned string from a borrowed one."],
    [c("format!(\"{a}{b}\")"), "Build a new " + c("String") + " from pieces without consuming them."],
    [c("push_str(&str)") + ", " + c("push(char)"), "Append to a mutable " + c("String") + "."],
    [c("&s[a..b]"), "Borrow a byte range. Panics if the boundary is inside a UTF-8 character."],
    [c("s.chars()") + ", " + c("s.bytes()"), "Iterate Unicode scalar values or raw bytes."],
    [c("s.len()"), "Length in <strong>bytes</strong>, not characters."],
  ],
),
p("Prefer " + c("&str") + " in function parameters — it accepts both literals and " + c("&String") + " via deref coercion. Return " + c("String") + " when the function creates new text."),
callout("warn", "Indexing a String", "You cannot write " + c("s[0]") + " to get a character: UTF-8 characters have variable width, so a byte index is not a character index. Use " + c("&s[0..1]") + " only for known-safe ASCII, or iterate with " + c("s.chars()") + "."),
h3("HashMap: key → value"),
codeblock(`use std::collections::HashMap;

fn main() {
    let mut scores: HashMap<String, i32> = HashMap::new();

    scores.insert(String::from("blue"), 10);
    scores.insert(String::from("yellow"), 50);

    println!("{:?}", scores.get("blue")); // Some(10)
    println!("{}", scores.get("green").copied().unwrap_or(0)); // 0

    for (team, score) in &scores {
        println!("{team}: {score}");
    }
}`),
p(c("get") + " returns " + c("Option<&V>") + ", so a missing key is not an error. " + c("insert") + " replaces any existing value. The " + c("entry") + " API combines “look up or insert” in one step, which is perfect for counting:"),
codeblock(`use std::collections::HashMap;

fn main() {
    let text = "the cat and the hat";
    let mut counts: HashMap<&str, u32> = HashMap::new();

    for word in text.split_whitespace() {
        *counts.entry(word).or_insert(0) += 1;
    }

    println!("{counts:?}");
}`),
p(c("or_insert(0)") + " returns a mutable reference to the existing value or inserts " + c("0") + " and returns a reference to that. Dereferencing with " + c("*") + " lets you increment it."),
p("Hash maps do not preserve insertion order, and iteration order can change between runs. If you need sorted keys, use " + c("BTreeMap") + "; if you need fast set membership, use " + c("HashSet") + ". Keys must implement " + c("Eq") + " and " + c("Hash") + "."),
p("For small lookup tables, a " + c("match") + " or an array is often simpler and faster than a hash map. Reach for " + c("HashMap") + " when the key set is dynamic."),
    ].join("\n"),
    practice: [
task({
  body: p(
    "Use the entry API to count every word in " +
      c("text") +
      ". Then run it: " +
      c('counts.get("the")') +
      " should be 3, and " +
      c("counts.len()") +
      " should be 3.",
  ),
  expect: "the -> 3\nunique = 3",
  hint:
    "Inside the loop: " +
    c("*counts.entry(word).or_insert(0) += 1;") +
    ". The " +
    c("*") +
    " dereferences the " +
    c("&mut u32") +
    " returned by " +
    c("or_insert") +
    ".",
}),
playground({
  starter: `use std::collections::HashMap;

fn main() {
    let text = "the quick the lazy the";
    let mut counts: HashMap<&str, u32> = HashMap::new();

    for word in text.split_whitespace() {
        // TODO: increase this word's count with the entry API
    }

    println!("the -> {}", counts.get("the").unwrap_or(&0));
    println!("unique = {}", counts.len());
}`,
  solution: `use std::collections::HashMap;

fn main() {
    let text = "the quick the lazy the";
    let mut counts: HashMap<&str, u32> = HashMap::new();

    for word in text.split_whitespace() {
        *counts.entry(word).or_insert(0) += 1;
    }

    println!("the -> {}", counts.get("the").unwrap_or(&0));
    println!("unique = {}", counts.len());
}`,
  expect: "the -> 3\nunique = 3",
}),
    ].join("\n"),
    questions: [
      {
        q: "What does " + c("scores.get(99)") + " return for a " + c("Vec<i32>") + "?",
        options: [
          "The value at index 99, or 0 if missing.",
          c("Option<&i32>") + ": " + c("Some") + " or " + c("None"),
          "It panics when the index is out of bounds.",
          "A copy of the whole vector.",
        ],
        answer: 1,
        explain:
          c("get") +
          " is the checked lookup and returns " +
          c("Option<&T>") +
          ". The " +
          c("[]") +
          " operator is the unchecked one and panics on an invalid index.",
      },
      {
        q: "Which method appends a " + c("&str") + " to an existing " + c("String") + "?",
        options: [c("s.push_str(\"more\")"), c("s + \"more\""), c("s.append(\"more\")"), c("s.extend(\"more\")")],
        answer: 0,
        explain:
          c("push_str") +
          " appends borrowed text and returns nothing. " +
          c("push") +
          " appends a single " +
          c("char") +
          ". The " +
          c("+") +
          " operator works but consumes the left-hand " +
          c("String") +
          "; " +
          c("format!") +
          " is usually clearer.",
      },
      {
        q: "What does " + c("map.entry(key).or_insert(0)") + " do?",
        options: [
          "Returns " + c("0") + " if the key is missing and removes the key.",
          "Inserts " + c("0") + " when the key is missing, then returns a mutable reference to the value.",
          "Panics if the key already exists.",
          "Returns an " + c("Option") + " without changing the map.",
        ],
        answer: 1,
        explain:
          "The entry API gives you a slot for a key. " +
          c("or_insert") +
          " fills it if needed and returns " +
          c("&mut V") +
          ", which is why counting uses " +
          c("*map.entry(k).or_insert(0) += 1") +
          ".",
      },
      {
        q: "What does " + c("String::len()") + " return?",
        options: [
          "The number of Unicode characters.",
          "The number of bytes in the UTF-8 encoding.",
          "The number of words.",
          "The allocated capacity.",
        ],
        answer: 1,
        explain:
          c("len") +
          " returns the byte length. " +
          c("chars().count()") +
          " returns the number of Unicode scalar values, which can be smaller for non-ASCII text.",
      },
    ],
  },

  /* ================================================================== *
   * 07 — Option, Result & Errors
   * ================================================================== */
  {
    id: "07",
    lede: "Rust has no exceptions and no null. Missing values use Option, recoverable failures use Result, and the question mark operator propagates errors without hiding them.",
    read: [
p("Many languages handle failure in two ways: throw an exception and hope someone catches it, or return null and hope someone checks. Rust makes both cases part of the type system, so the compiler can see whether you handled them."),
h3("Panics: unrecoverable bugs"),
p("A panic aborts the current operation. You cannot catch it in normal code (well, " + c("catch_unwind") + " exists, but it is for special cases). Use panics for broken invariants, not for expected failures like bad user input:"),
codeblock(`fn main() {
    let values = vec![1, 2, 3];

    // index 99 does not exist: this panics at runtime
    println!("{}", values[99]);
}`),
p("A panic prints a message and unwinds the stack, running destructors as it goes. In a library, treat panics as a last resort — callers cannot easily recover from them."),
h3("Option: a value might be absent"),
codeblock(`fn find_score(name: &str) -> Option<u32> {
    if name == "ferris" {
        Some(42)
    } else {
        None
    }
}

fn main() {
    match find_score("ferris") {
        Some(score) => println!("score: {score}"),
        None => println!("no score"),
    }

    let fallback = find_score("nobody").unwrap_or(0);
    println!("fallback: {fallback}");
}`),
p(c("unwrap") + " extracts the value or panics on " + c("None") + ". Use it when absence would be a bug, or in tiny examples. In real code prefer " + c("match") + ", " + c("if let") + ", " + c("unwrap_or") + ", or " + c("?") + "."),
h3("Result: an operation might fail"),
p(c("Result<T, E>") + " has two variants: " + c("Ok(T)") + " for success and " + c("Err(E)") + " for failure. The error carries information about what went wrong."),
codeblock(`fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err(String::from("cannot divide by zero"))
    } else {
        Ok(a / b)
    }
}

fn main() {
    match divide(10.0, 2.0) {
        Ok(value) => println!("{value}"),
        Err(message) => println!("error: {message}"),
    }
}`),
p("Parsing is the canonical example. " + c("str::parse") + " returns a " + c("Result") + " because text is not always a number:"),
codeblock(`fn main() {
    let good: i32 = "42".parse().expect("not a number");
    println!("{good}");

    match "oops".parse::<i32>() {
        Ok(number) => println!("parsed {number}"),
        Err(error) => println!("could not parse: {error}"),
    }
}`),
p(c("expect") + " is like " + c("unwrap") + " but takes a message that appears in the panic. It still panics, so it is for cases where failure is genuinely impossible or indicates a bug."),
h3("Propagating with ?"),
p("Most functions should not decide how to handle an error. The " + c("?") + " operator says: if the result is " + c("Err") + ", return it from the current function; otherwise unwrap the " + c("Ok") + " and continue."),
codeblock(`use std::fs;

fn read_username() -> Result<String, std::io::Error> {
    let text = fs::read_to_string("username.txt")?;
    Ok(text.trim().to_string())
}

fn main() {
    match read_username() {
        Ok(name) => println!("hello, {name}"),
        Err(error) => println!("could not read file: {error}"),
    }
}`),
p("You can use " + c("?") + " only in a function that returns a compatible " + c("Result") + " (or " + c("Option") + "). The error type must be convertible into the function's error type. " + c("main") + " can return a " + c("Result") + " too:"),
codeblock(`use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
    let number: i32 = "42".parse()?;
    println!("{number}");
    Ok(())
}`),
p("Here " + c("Box<dyn Error>") + " is a boxed trait object that can hold many error types. It is convenient for small binaries; libraries usually define a concrete error enum. The " + c("anyhow") + " and " + c("thiserror") + " crates are popular helpers once your error types grow."),
table(
  ["Tool", "Use it when…"],
  [
    [c("match") + " / " + c("if let"), "You need to handle each case explicitly."],
    [c("unwrap_or(default)"), "A sensible fallback exists."],
    [c("unwrap()") + " / " + c("expect(msg)"), "Failure is a bug and panicking is acceptable."],
    [c("?"), "You want to propagate the error to the caller."],
    [c("unwrap_or_else(f)"), "You need to compute the fallback lazily or log the error."],
  ],
),
callout("note", "Option is not Result", c("Option") + " says a value may be absent; that is not necessarily an error. " + c("Result") + " says an operation failed and carries a reason. Choosing the right one makes APIs self-documenting."),
    ].join("\n"),
    practice: [
task({
  body: p(
    "The program panics on " +
      c('"oops"') +
      ". Handle the parse failure instead: print " +
      c("skipping oops") +
      " and keep adding the valid numbers. The final total should be 19.",
  ),
  expect: "skipping oops\ntotal = 19",
  hint:
    "Replace " +
    c(".unwrap()") +
    " with a " +
    c("match") +
    " on " +
    c('input.parse::<i32>()') +
    ". The " +
    c("Ok") +
    " arm adds, the " +
    c("Err") +
    " arm prints the warning.",
}),
playground({
  starter: `fn main() {
    let inputs = ["12", "oops", "7"];
    let mut total = 0;

    for input in inputs {
        // TODO: handle the parse failure instead of panicking
        let number: i32 = input.parse().unwrap();
        total += number;
    }

    println!("total = {total}");
}`,
  solution: `fn main() {
    let inputs = ["12", "oops", "7"];
    let mut total = 0;

    for input in inputs {
        match input.parse::<i32>() {
            Ok(number) => total += number,
            Err(_) => println!("skipping {input}"),
        }
    }

    println!("total = {total}");
}`,
  expect: "skipping oops\ntotal = 19",
}),
    ].join("\n"),
    questions: [
      {
        q: "Which type should a function return when an operation can fail in a recoverable way?",
        options: ["Option<T>", "Result<T, E>", "T", "panic!(...)"],
        answer: 1,
        explain:
          c("Result<T, E>") +
          " carries either a success value or an error value with details. " +
          c("Option") +
          " only expresses presence or absence, and a panic cannot be handled by the caller.",
      },
      {
        q: "What does the " + c("?") + " operator do?",
        options: [
          "Ignores the error and returns a default value.",
          "Returns " + c("Err") + " early from the function, or unwraps " + c("Ok") + " and continues.",
          "Panics immediately on any error.",
          "Converts the error to a " + c("String") + " automatically.",
        ],
        answer: 1,
        explain:
          c("?") +
          " propagates the error to the caller using the " +
          c("From") +
          " conversion, so the function's error type must be compatible. It replaces a lot of boilerplate " +
          c("match") +
          " expressions.",
      },
      {
        q: "What happens if you call " + c("unwrap()") + " on an " + c("Err") + "?",
        options: [
          "It returns " + c("None") + ".",
          "It logs the error and returns 0.",
          "It panics.",
          "It retries the operation.",
        ],
        answer: 2,
        explain:
          c("unwrap") +
          " panics on " +
          c("Err") +
          " (and " +
          c("None") +
          "). That is acceptable in tests and examples, but user input and I/O should be handled or propagated.",
      },
      {
        q: "What is the difference between " + c("Option") + " and " + c("Result") + "?",
        options: [
          "There is none; they are aliases.",
          c("Option") + " models absence; " + c("Result") + " models failure with an error value.",
          c("Option") + " is for numbers only.",
          c("Result") + " can only be used in " + c("main"),
        ],
        answer: 1,
        explain:
          "A missing middle name is " +
          c("Option") +
          "; a failed file read is " +
          c("Result") +
          ". The distinction keeps “nothing here” separate from “this went wrong, and here is why”.",
      },
    ],
  },

  /* ================================================================== *
   * 08 — Traits, Generics & Lifetimes
   * ================================================================== */
  {
    id: "08",
    lede: "Generics let one function work for many types; traits describe what those types must be able to do. Lifetimes are the third piece: they tell the compiler how long references are valid.",
    read: [
p("Rust has no class inheritance. Instead, behaviour is described by traits, and flexibility comes from generics. This keeps code explicit: a function says exactly which capabilities it needs, and the compiler checks that every concrete type provides them."),
h3("Generic functions"),
codeblock(`fn largest<T: PartialOrd>(items: &[T]) -> &T {
    let mut largest = &items[0];

    for item in items {
        if item > largest {
            largest = item;
        }
    }

    largest
}

fn main() {
    let numbers = [3, 9, 2, 7];
    let words = ["pear", "apple", "plum"];

    println!("{}", largest(&numbers));
    println!("{}", largest(&words));
}`),
p("The " + c("<T: PartialOrd>") + " introduces a type parameter " + c("T") + " and a bound: " + c("T") + " must implement " + c("PartialOrd") + ", because the function uses " + c(">") + ". Without the bound, the compiler cannot assume the comparison exists. Generics are compiled into specialised code for each concrete type (monomorphisation), so they cost nothing at runtime."),
p("Structs and enums can be generic too:"),
codeblock(`struct Point<T> {
    x: T,
    y: T,
}

fn main() {
    let integer = Point { x: 3, y: 7 };
    let float = Point { x: 1.5, y: 2.5 };

    println!("{} {}", integer.x, float.y);
}`),
h3("Traits: shared behaviour"),
p("A trait is a contract. It declares methods, optionally with default implementations. Types opt in with " + c("impl Trait for Type") + ":"),
codeblock(`trait Describable {
    fn describe(&self) -> String;

    fn shout(&self) -> String {
        self.describe().to_uppercase()
    }
}

struct Book {
    title: String,
    pages: u32,
}

impl Describable for Book {
    fn describe(&self) -> String {
        format!("{} ({} pages)", self.title, self.pages)
    }
}

fn announce(item: &impl Describable) {
    println!("{}", item.shout());
}

fn main() {
    let book = Book {
        title: String::from("Rust in Action"),
        pages: 400,
    };

    announce(&book);
}`),
ul(
  c("impl Trait") + " in a parameter position means “any type that implements this trait”.",
  "The generic form " + c("fn announce<T: Describable>(item: &T)") + " is equivalent but lets you name the type or use it in several places.",
  "Default methods like " + c("shout") + " can call required methods like " + c("describe") + " and can be overridden.",
  "A type can implement many traits, and a trait can be implemented for types you did not write (subject to the orphan rule).",
),
p("Common standard-library traits include " + c("Debug") + ", " + c("Clone") + ", " + c("Copy") + ", " + c("PartialEq") + ", " + c("PartialOrd") + ", " + c("Iterator") + ", and " + c("Display") + ". Many can be derived automatically with " + c("#[derive(...)]") + ". Traits can also be combined in bounds: " + c("T: Describable + Clone") + "."),
p("When you need a collection of different types that share behaviour, use a trait object: " + c("Vec<Box<dyn Describable>>") + ". That uses dynamic dispatch instead of monomorphisation — slightly slower, but homogeneous to store."),
h3("Lifetimes: how long is a reference valid?"),
p("Every reference has a lifetime. Most of the time the compiler infers it, so you never write it down. Sometimes it needs help describing how input and output references relate:"),
codeblock(`fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let first = String::from("long");
    let second = "xy";

    println!("{}", longest(&first, second));
}`),
p("The annotation does not make anything live longer. It says: the returned reference is valid for at most the shorter of the two input lifetimes, and the caller must respect that. Without it, the compiler rejects the function because it cannot prove the result is safe:"),
codeblock(`// error[E0106]: missing lifetime specifier
fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() { x } else { y }
}`, "does not compile"),
p("Structs that hold references need lifetime parameters too:"),
codeblock(`struct Excerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().unwrap();
    let excerpt = Excerpt { part: first_sentence };

    println!("{}", excerpt.part);
}`),
p("Most functions never need explicit lifetimes — this is called lifetime elision. When a struct stores a borrow, or when a function has several reference inputs and returns a reference, you may need to spell out the relationship."),
callout("tip", "Read lifetimes as constraints, not timers", "'a is not a countdown. It is a name for “some region of code”. Saying several references share 'a means they must all be valid for the same region — usually the shortest one involved."),
    ].join("\n"),
    practice: [
task({
  body: p(
    "Implement " +
      c("Describable") +
      " for " +
      c("Movie") +
      " (see the format string in the comments), then announce the movie as well. Both calls should print one line each.",
  ),
  expect: "Book: Rust in Action (400 pages)\nMovie: Ferris (95 min)",
  hint:
    "The impl starts with " +
    c("impl Describable for Movie {") +
    ". Inside " +
    c("describe") +
    ", use " +
    c("format!(\"Movie: {} ({} min)\", self.title, self.minutes)") +
    ". Then call " +
    c("announce(&movie);") +
    ".",
}),
playground({
  starter: `trait Describable {
    fn describe(&self) -> String;
}

struct Book {
    title: String,
    pages: u32,
}

struct Movie {
    title: String,
    minutes: u32,
}

impl Describable for Book {
    fn describe(&self) -> String {
        format!("Book: {} ({} pages)", self.title, self.pages)
    }
}

// TODO: implement Describable for Movie

fn announce(item: &impl Describable) {
    println!("{}", item.describe());
}

fn main() {
    let book = Book {
        title: String::from("Rust in Action"),
        pages: 400,
    };
    let movie = Movie {
        title: String::from("Ferris"),
        minutes: 95,
    };

    announce(&book);
    // TODO: announce the movie too
}`,
  solution: `trait Describable {
    fn describe(&self) -> String;
}

struct Book {
    title: String,
    pages: u32,
}

struct Movie {
    title: String,
    minutes: u32,
}

impl Describable for Book {
    fn describe(&self) -> String {
        format!("Book: {} ({} pages)", self.title, self.pages)
    }
}

impl Describable for Movie {
    fn describe(&self) -> String {
        format!("Movie: {} ({} min)", self.title, self.minutes)
    }
}

fn announce(item: &impl Describable) {
    println!("{}", item.describe());
}

fn main() {
    let book = Book {
        title: String::from("Rust in Action"),
        pages: 400,
    };
    let movie = Movie {
        title: String::from("Ferris"),
        minutes: 95,
    };

    announce(&book);
    announce(&movie);
}`,
  expect: "Book: Rust in Action (400 pages)\nMovie: Ferris (95 min)",
}),
    ].join("\n"),
    questions: [
      {
        q: "What is a trait for?",
        options: [
          "To inherit fields from a parent struct.",
          "To declare shared behaviour that multiple types can implement.",
          "To allocate memory on the heap.",
          "To replace modules.",
        ],
        answer: 1,
        explain:
          "A trait is an interface: a set of methods (and optionally associated items) that a type promises to provide. It enables generic code and trait objects without class inheritance.",
      },
      {
        q: "What does the bound " + c("T: PartialOrd") + " mean?",
        options: [
          "T is always a number.",
          "T implements the " + c("PartialOrd") + " trait, so values can be compared with " + c(">") + ".",
          "T can only be used once.",
          "T must be a reference.",
        ],
        answer: 1,
        explain:
          "The bound tells the compiler which operations are legal inside the generic function. " +
          c("PartialOrd") +
          " provides comparison operators; without it, " +
          c("item > largest") +
          " would not type-check.",
      },
      {
        q: "What does a lifetime annotation such as " + c("'a") + " actually do?",
        options: [
          "It extends the lifetime of a value.",
          "It describes a relationship between reference lifetimes so the compiler can verify them.",
          "It makes a value static.",
          "It enables garbage collection.",
        ],
        answer: 1,
        explain:
          "Lifetimes are compile-time constraints. They never change how long a value lives; they let the compiler prove that no reference outlives the data it points to.",
      },
      {
        q: "What does " + c("fn print(item: &impl Describable)") + " accept?",
        options: [
          "Only " + c("Book") + " values.",
          "Any type that implements " + c("Describable") + ".",
          "Only trait objects behind a " + c("Box") + ".",
          "Any type at all.",
        ],
        answer: 1,
        explain:
          c("impl Trait") +
          " in argument position is sugar for a generic parameter with that bound. Any type implementing the trait is accepted, and the compiler generates the appropriate specialised function.",
      },
    ],
  },

  /* ================================================================== *
   * 09 — Iterators & Closures
   * ================================================================== */
  {
    id: "09",
    lede: "Iterators and closures are where Rust starts to feel functional. Chains of map, filter, and collect replace manual loops — and because iterators are lazy, nothing runs until you ask for a result.",
    read: [
p("A closure is an anonymous function that can capture variables from its environment. An iterator is a sequence you can transform and consume. Together they let you express “take these items, keep the ones that match, transform them, and sum the result” as a short, readable pipeline."),
h3("Closures"),
codeblock(`fn main() {
    let double = |n: i32| n * 2;
    println!("{}", double(21));

    let base = 10;
    let add_base = |n| n + base; // captures base by reference
    println!("{}", add_base(5));
}`),
p("The parameter and return types can usually be inferred from the first use. A closure that only borrows its environment implements " + c("Fn") + "; one that mutates captured variables implements " + c("FnMut") + "; one that consumes them implements " + c("FnOnce") + ". Most of the time you do not write these bounds by hand."),
codeblock(`fn main() {
    let name = String::from("Ferris");

    // move forces the closure to take ownership of name
    let greet = move || println!("Hello, {name}!");

    greet();
    // println!("{name}"); // error: name was moved into the closure
}`),
p("Without " + c("move") + ", the closure would borrow " + c("name") + ". The " + c("move") + " keyword is essential when a closure outlives the current scope, such as when you spawn a thread."),
h3("Iterators are lazy"),
p("Calling " + c(".map(...)") + " or " + c(".filter(...)") + " does not process anything. It builds an adapter that describes the work. The work happens when a consuming method such as " + c("collect") + ", " + c("sum") + ", or " + c("for_each") + " asks for items:"),
codeblock(`fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6];

    let evens: Vec<i32> = numbers
        .iter()
        .copied()
        .filter(|n| n % 2 == 0)
        .collect();

    println!("{evens:?}"); // [2, 4, 6]
}`),
p(c("iter()") + " yields references, " + c("iter_mut()") + " yields mutable references, and " + c("into_iter()") + " consumes the collection and yields owned values. That is why " + c(".copied()") + " appears above: it turns " + c("&i32") + " into " + c("i32") + " so the result can own its elements."),
table(
  ["Adapter", "What it does"],
  [
    [c("map(f)"), "Transform every item with " + c("f") + "."],
    [c("filter(p)"), "Keep items for which " + c("p") + " returns true. The closure receives a reference to the item."],
    [c("enumerate()"), "Pair each item with its index: " + c("(0, first)") + ", " + c("(1, second)") + ", …"],
    [c("take(n)") + " / " + c("skip(n)"), "Keep the first n items / drop the first n."],
    [c("zip(other)"), "Pair items from two iterators."],
    [c("chain(other)"), "Concatenate two iterators."],
  ],
),
table(
  ["Consumer", "What it returns"],
  [
    [c("collect()"), "A collection, such as " + c("Vec<T>") + " or " + c("HashMap") + " — often needs a type annotation."],
    [c("sum()") + " / " + c("product()"), "The sum or product of all items."],
    [c("count()"), "How many items were produced."],
    [c("fold(init, f)"), "A single accumulated value."],
    [c("any(p)") + " / " + c("all(p)"), "Whether any / all items satisfy a predicate."],
    [c("find(p)"), "The first matching item as an " + c("Option") + "."],
  ],
),
codeblock(`fn main() {
    let total: i32 = (1..=10)
        .filter(|n| n % 2 == 0)
        .map(|n| n * n)
        .sum();

    println!("{total}"); // 220

    for (index, name) in ["Ada", "Linus", "Ferris"].iter().enumerate() {
        println!("{index}: {name}");
    }

    let sum = (1..=5).fold(0, |acc, n| acc + n);
    println!("{sum}"); // 15
}`),
p("Iterator chains compile down to code as efficient as a hand-written loop, sometimes better because the compiler can eliminate bounds checks. Prefer them when they make the intent clearer; a plain " + c("for") + " loop is still perfectly idiomatic when the body has side effects or complex control flow."),
callout("tip", "The compiler is your type checker for chains", "When a chain does not compile, add an explicit type annotation at the " + c("collect") + " and split the chain into temporary variables. Most iterator errors are about whether the closure receives " + c("T") + " or " + c("&T") + "."),
    ].join("\n"),
    practice: [
task({
  body: p(
    "Replace the placeholder with a single iterator chain over " +
      c("1..=10") +
      ": keep the even numbers, square each one, and sum the results. The answer is 220.",
  ),
  expect: "sum = 220",
  hint:
    c("numbers.filter(|n| n % 2 == 0).map(|n| n * n).sum()") +
    ". The type annotation " +
    c("let total: i32") +
    " tells " +
    c("sum") +
    " what to produce.",
}),
playground({
  starter: `fn main() {
    let numbers = 1..=10;

    // TODO: keep only even numbers, square them, and sum the results
    let total: i32 = 0;

    println!("sum = {total}");
}`,
  solution: `fn main() {
    let numbers = 1..=10;

    let total: i32 = numbers
        .filter(|n| n % 2 == 0)
        .map(|n| n * n)
        .sum();

    println!("sum = {total}");
}`,
  expect: "sum = 220",
}),
    ].join("\n"),
    questions: [
      {
        q: "When does an iterator chain actually do its work?",
        options: [
          "As soon as " + c(".map()") + " is called.",
          "When a consuming method such as " + c(".collect()") + " or " + c(".sum()") + " is called.",
          "When the variable is declared.",
          "At compile time.",
        ],
        answer: 1,
        explain:
          "Adapters are lazy: they only describe a transformation. A consumer drives the iteration and produces a value. This lets the compiler fuse the steps into one efficient loop.",
      },
      {
        q: "What does the closure in " + c(".filter(|n| n % 2 == 0)") + " receive?",
        options: [
          "An owned copy of each item.",
          "A reference to each item.",
          "The index of each item.",
          "The whole iterator.",
        ],
        answer: 1,
        explain:
          c("filter") +
          " passes " +
          c("&Self::Item") +
          " to its predicate, so an iterator of " +
          c("i32") +
          " gives the closure " +
          c("&i32") +
          ". Use " +
          c("*n") +
          " when you need the owned value.",
      },
      {
        q: "Why does " + c("let evens: Vec<i32> = numbers.iter().filter(...).collect();") + " include a type annotation?",
        options: [
          "Rust requires annotations on every variable.",
          c("collect") + " can produce many collection types, so the target type disambiguates it.",
          "The annotation makes the chain lazy.",
          "It prevents the closure from capturing values.",
        ],
        answer: 1,
        explain:
          c("collect") +
          " is generic over the result type. Without an annotation, the compiler may not know whether you want a " +
          c("Vec") +
          ", a " +
          c("HashSet") +
          ", a " +
          c("String") +
          ", or something else.",
      },
      {
        q: "What does a " + c("move") + " closure do?",
        options: [
          "It runs on another thread automatically.",
          "It takes ownership of the values it captures.",
          "It can only be called once.",
          "It prevents the closure from returning a value.",
        ],
        answer: 1,
        explain:
          c("move") +
          " makes the closure capture by value instead of by reference. This is necessary when the closure must outlive the current scope, for example when moving it into a thread.",
      },
    ],
  },

  /* ================================================================== *
   * 10 — Modules, Crates & Testing
   * ================================================================== */
  {
    id: "10",
    lede: "A single main.rs stops scaling quickly. Split code into modules, pull in libraries from crates.io, and use Cargo's test runner to prove the pieces work — then go build something.",
    read: [
p("So far every example has lived in one file. Real projects have many. Rust organises code with modules inside a crate, and crates inside a package. The rules are small: items are private by default, and " + c("pub") + " opens them up."),
h3("Modules and privacy"),
codeblock(`mod greetings {
    pub fn hello(name: &str) -> String {
        format!("Hello, {name}!")
    }

    fn secret() -> &'static str {
        "internal"
    }
}

use greetings::hello;

fn main() {
    println!("{}", hello("Ferris"));

    // greetings::secret(); // error: function is private
}`),
p("A module is a namespace. By default its contents are visible only inside the module and its descendants. " + c("pub") + " exposes an item to the parent, and the parent can re-export it with " + c("pub use") + ". " + c("use") + " brings a path into scope without changing where the item lives."),
p("For larger projects, put modules in their own files. " + c("mod greetings;") + " in " + c("main.rs") + " loads " + c("src/greetings.rs") + " (or " + c("src/greetings/mod.rs") + "):"),
codeblock(`src/
├── main.rs          # mod greetings; use greetings::hello;
├── greetings.rs     # pub fn hello(...)
├── models.rs        # pub mod user; pub mod post;
└── models/
    ├── user.rs
    └── post.rs`, "project layout", "text"),
p("Paths work like file paths: " + c("crate::greetings::hello") + " starts at the crate root, " + c("super::") + " refers to the parent module, and " + c("self::") + " to the current one. Keep modules focused, and keep the public surface small."),
h3("Packages, crates, and dependencies"),
p("A package is a directory with a " + c("Cargo.toml") + ". It contains one or more crates: a binary crate rooted at " + c("src/main.rs") + ", a library crate rooted at " + c("src/lib.rs") + ", or both. A library can be used by the binary and by other projects."),
p("External crates come from crates.io. Add one with Cargo, which updates " + c("Cargo.toml") + " and " + c("Cargo.lock") + ":"),
codeblock(`cargo add serde --features derive`, "terminal", "text"),
codeblock(`[package]
name = "my_app"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = { version = "1", features = ["derive"] }`, "Cargo.toml", "toml"),
p("Then " + c("use serde::{Serialize, Deserialize};") + " and derive the traits. Dependencies are compiled once and cached; " + c("Cargo.lock") + " pins exact versions so everyone on the team builds the same code. Audit dependencies you add: each one is code you now trust."),
h3("Tests live next to the code"),
p("Rust has a built-in test runner. Mark test functions with " + c("#[test]") + ", put them in a module gated by " + c("#[cfg(test)]") + ", and run " + c("cargo test") + ":"),
codeblock(`pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg(test)]
mod tests {
    use super::*; // bring add() into scope

    #[test]
    fn adds_positive_numbers() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    fn adds_negative_numbers() {
        assert_eq!(add(-2, -3), -5);
    }
}`),
ul(
  c("#[test]") + " marks a function as a test. It takes no arguments and returns nothing.",
  c("assert!") + ", " + c("assert_eq!") + ", and " + c("assert_ne!") + " panic with a useful message when the condition fails.",
  c("#[cfg(test)]") + " means the module is compiled only for tests, so test code never ships in release builds.",
  c("use super::*") + " imports the parent module's items, giving tests access to private functions in the same module.",
  c("#[should_panic(expected = \"...\")]") + " asserts that a test panics with a message containing the given text.",
),
p("Run the suite with " + c("cargo test") + ". Cargo compiles the crate in test mode and runs every " + c("#[test]") + " in parallel. You will see a summary like:"),
codeblock(`running 2 tests
test tests::adds_negative_numbers ... ok
test tests::adds_positive_numbers ... ok

test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out`, "cargo test", "text"),
p("Integration tests go in the " + c("tests/") + " directory at the package root. Each file there is compiled as a separate crate, so it can only use your public API:"),
codeblock(`// tests/integration.rs
use my_crate::add;

#[test]
fn adds_from_outside() {
    assert_eq!(add(1, 2), 3);
}`),
p("Documentation comments (" + c("///") + ") can contain code blocks. " + c("cargo test") + " compiles and runs those too, which keeps examples in your docs honest. That is three layers of tests — unit, integration, and documentation — with no extra framework."),
h3("The day-to-day toolkit"),
table(
  ["Command", "What it is for"],
  [
    [c("cargo check"), "Fast type-check while editing."],
    [c("cargo fmt"), "Format code with rustfmt — stop arguing about style."],
    [c("cargo clippy"), "Run hundreds of extra lints for idiomatic code."],
    [c("cargo test"), "Run unit, integration, and doc tests."],
    [c("cargo doc --open"), "Build documentation from doc comments and open it."],
    [c("cargo build --release"), "Optimised build for distribution."],
  ],
),
h3("Where to go next"),
ul(
  "Read <a href=\"https://doc.rust-lang.org/book/\" target=\"_blank\" rel=\"noopener\">The Rust Programming Language</a> — it goes deeper on every topic here.",
  "Work through <a href=\"https://github.com/rust-lang/rustlings\" target=\"_blank\" rel=\"noopener\">Rustlings</a> for short compiler-error exercises.",
  "Build a CLI with " + c("clap") + ", a web service with " + c("axum") + ", or an async tool with " + c("tokio") + ".",
  "When you hit a borrow-checker error, reduce it to a tiny example and read the compiler's suggestion. It is usually right.",
),
callout("tip", "The finish line is a starting line", "You now know enough Rust to read real code and be dangerous in a good way. Pick a small project you would otherwise write in another language, port it, and let the compiler teach you the rest."),
    ].join("\n"),
    practice: [
task({
  body: p(
    "This editor runs " +
      c("cargo test") +
      ", not " +
      c("main") +
      ". Both tests fail because " +
      c("add") +
      " subtracts instead of adding. Fix the function (leave the tests alone), then run again until the suite is green.",
  ),
  expect: "test result: ok. 2 passed; 0 failed",
  hint:
    "Change " +
    c("a - b") +
    " to " +
    c("a + b") +
    ". Read the failure output first: it shows the expected and actual values, which is the whole point of tests.",
}),
playground({
  tests: true,
  starter: `pub fn add(a: i32, b: i32) -> i32 {
    a - b // TODO: fix this function
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn adds_positive_numbers() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    fn adds_negative_numbers() {
        assert_eq!(add(-2, -3), -5);
    }
}`,
  solution: `pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn adds_positive_numbers() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    fn adds_negative_numbers() {
        assert_eq!(add(-2, -3), -5);
    }
}`,
}),
    ].join("\n"),
    questions: [
      {
        q: "What does " + c("pub") + " do to an item?",
        options: [
          "Makes it public to other modules and crates.",
          "Makes it mutable.",
          "Moves it to the crate root.",
          "Runs it at startup.",
        ],
        answer: 0,
        explain:
          "Items are private by default. " +
          c("pub") +
          " exposes them to the parent module, and enough " +
          c("pub") +
          " along the path makes them reachable from outside the crate.",
      },
      {
        q: "Which attribute marks a function as a test?",
        options: [c("#[test]"), c("#[cfg(test)]"), c("#[bench]"), c("#[unit]")],
        answer: 0,
        explain:
          c("#[test]") +
          " registers the function with the test harness. " +
          c("#[cfg(test)]") +
          " controls whether a whole module is compiled in test builds.",
      },
      {
        q: "Which command runs your test suite?",
        options: [c("cargo build"), c("cargo test"), c("cargo check"), c("cargo run --test")],
        answer: 1,
        explain:
          c("cargo test") +
          " compiles the crate in test mode and runs unit, integration, and documentation tests. " +
          c("cargo check") +
          " only type-checks.",
      },
      {
        q: "Why wrap test modules in " + c("#[cfg(test)]") + "?",
        options: [
          "To make the tests run faster.",
          "So the module is compiled only for tests and excluded from normal builds.",
          "To allow tests to use " + c("unsafe") + " code.",
          "To force tests to run in order.",
        ],
        answer: 1,
        explain:
          c("#[cfg(test)]") +
          " is a conditional-compilation attribute. It keeps test-only helpers and tests out of production binaries, reducing size and avoiding unused-code warnings.",
      },
    ],
  },
];
