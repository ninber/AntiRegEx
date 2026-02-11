// antiRegexName.js
// Human-Readable Anti-Regex Name Generator
// ES Module — GitHub Pages compatible

/* =========================
   Utility Functions
========================= */

function splitCamelCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[\s_\-\.]+/)
    .map(w => w.toLowerCase())
    .filter(Boolean);
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function maybe(prob) {
  return Math.random() < prob;
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

/* =========================
   Anchored Scrambling
========================= */

function scrambleInteriorAnchored(word, fixFirst, fixLast) {
  const len = word.length;

  if (len < 4) return word;
  if (fixFirst + fixLast >= len - 1) return word;

  const start = word.slice(0, fixFirst);
  const end = word.slice(len - fixLast);
  const middle = word.slice(fixFirst, len - fixLast).split("");

  const shuffled = shuffleArray(middle);

  return start + shuffled.join("") + end;
}

/* =========================
   Substitution
========================= */

function substituteWord(word, map) {
  return map[word] || word;
}

function substituteChars(word, map) {
  return word
    .split("")
    .map(c => map[c] || c)
    .join("");
}

/* =========================
   Main Generator
========================= */

export function generateVariants(input, userConfig = {}) {

  const defaultConfig = {

    template: {
      enabled: true,
      templates: ["shuffle", "dropOne", "reverse"]
    },

    scramble: {
      enabled: true,
      probability: 0.5,
      fixFirst: 1,
      fixLast: 1
    },

    substitution: {
      enabled: true,
      probability: 0.4,
      wordMap: {
        for: "4",
        to: "2",
        you: "u",
        are: "r",
        and: "n"
      },
      charMap: {
        a: "4",
        e: "3",
        i: "1",
        o: "0",
        s: "5"
      }
    },

    separator: {
      enabled: true,
      separators: ["-", "_", ".", ":"]
    },

    casing: {
      enabled: true,
      modes: ["camel", "pascal", "lower"]
    },

    count: 10
  };

  // Deep merge for nested objects
  const config = {
    ...defaultConfig,
    ...userConfig,
    template: { ...defaultConfig.template, ...userConfig.template },
    scramble: { ...defaultConfig.scramble, ...userConfig.scramble },
    substitution: { ...defaultConfig.substitution, ...userConfig.substitution },
    separator: { ...defaultConfig.separator, ...userConfig.separator },
    casing: { ...defaultConfig.casing, ...userConfig.casing }
  };

  const baseWords = splitCamelCase(input);
  const results = new Set();

  while (results.size < config.count) {

    let words = [...baseWords];

    /* =========================
       TEMPLATE STEP
    ========================= */

    if (config.template.enabled && config.template.templates.length) {
      const t = randomChoice(config.template.templates);

      if (t === "shuffle") words = shuffleArray(words);

      if (t === "dropOne" && words.length > 1) {
        words.splice(Math.floor(Math.random() * words.length), 1);
      }

      if (t === "reverse") words.reverse();
    }

    /* =========================
       SUBSTITUTION STEP
    ========================= */

    if (config.substitution.enabled) {
      words = words.map(w => {
        if (maybe(config.substitution.probability)) {
          w = substituteWord(w, config.substitution.wordMap);
          w = substituteChars(w, config.substitution.charMap);
        }
        return w;
      });
    }

    /* =========================
       SCRAMBLE STEP
    ========================= */

    let forceSeparator = false;

    if (config.scramble.enabled) {
      words = words.map(w => {
        if (maybe(config.scramble.probability)) {
          forceSeparator = true;
          return scrambleInteriorAnchored(
            w,
            config.scramble.fixFirst,
            config.scramble.fixLast
          );
        }
        return w;
      });
    }

    /* =========================
       SEPARATOR STEP
    ========================= */

    let separator = "";

    if ((config.separator.enabled && config.separator.separators.length) || forceSeparator) {
      separator = randomChoice(config.separator.separators);
    }

    let combined = words.join(separator);

    /* =========================
       CASING STEP
    ========================= */

    if (config.casing.enabled && config.casing.modes.length) {
      const mode = randomChoice(config.casing.modes);

      if (mode === "lower") {
        combined = combined.toLowerCase();
      }

      if (mode === "camel") {
        const parts = combined.split(separator);
        combined = parts
          .map((w, i) =>
            i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)
          )
          .join(separator);
      }

      if (mode === "pascal") {
        const parts = combined.split(separator);
        combined = parts
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(separator);
      }
    }

    results.add(combined);
  }

  return Array.from(results);
}
