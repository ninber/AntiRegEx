// antiRegexName.js
// Advanced Human-Readable Anti-Regex Generator
// Lightweight, ES Module compatible

/* =========================
   Utilities
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
   Anchored Scramble
========================= */

function scrambleInteriorAnchored(word, fixFirst, fixLast) {
  const len = word.length;
  if (len < 4) return word;
  if (fixFirst + fixLast >= len - 1) return word;

  const start = word.slice(0, fixFirst);
  const end = word.slice(len - fixLast);
  const middle = word.slice(fixFirst, len - fixLast).split("");

  return start + shuffleArray(middle).join("") + end;
}

/* =========================
   Synonym Replacement
========================= */

function substituteSynonym(word, synonymMap) {
  if (!synonymMap[word]) return word;
  return randomChoice(synonymMap[word]);
}

/* =========================
   Non-Deterministic Char Map
========================= */

function substituteCharsRandom(word, charMap) {
  return word
    .split("")
    .map(c => {
      if (charMap[c]) {
        return randomChoice(charMap[c]);
      }
      return c;
    })
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

    synonym: {
      enabled: true,
      probability: 0.4,
      map: {
        site: ["site", "hub", "page", "portal"],
        web: ["web", "net", "online"],
        super: ["super", "ultra", "hyper"]
      }
    },

    substitution: {
      enabled: true,
      probability: 0.5,
      charMap: {
        a: ["a", "4"],
        e: ["e", "3", "€"],
        i: ["i", "1"],
        o: ["o", "0"],
        s: ["s", "5", "$", "z"]
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

  // Deep merge
  const config = {
    ...defaultConfig,
    ...userConfig,
    template: { ...defaultConfig.template, ...userConfig.template },
    scramble: { ...defaultConfig.scramble, ...userConfig.scramble },
    synonym: { ...defaultConfig.synonym, ...userConfig.synonym },
    substitution: { ...defaultConfig.substitution, ...userConfig.substitution },
    separator: { ...defaultConfig.separator, ...userConfig.separator },
    casing: { ...defaultConfig.casing, ...userConfig.casing }
  };

  const baseWords = splitCamelCase(input);
  const results = new Set();

  while (results.size < config.count) {

    let words = [...baseWords];

    /* TEMPLATE */
    if (config.template.enabled && config.template.templates.length) {
      const t = randomChoice(config.template.templates);

      if (t === "shuffle") words = shuffleArray(words);
      if (t === "dropOne" && words.length > 1)
        words.splice(Math.floor(Math.random() * words.length), 1);
      if (t === "reverse") words.reverse();
    }

    /* SYNONYMS */
    if (config.synonym.enabled) {
      words = words.map(w =>
        maybe(config.synonym.probability)
          ? substituteSynonym(w, config.synonym.map)
          : w
      );
    }

    /* SCRAMBLE */
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

    /* CHAR SUBSTITUTION */
    if (config.substitution.enabled) {
      words = words.map(w =>
        maybe(config.substitution.probability)
          ? substituteCharsRandom(w, config.substitution.charMap)
          : w
      );
    }

    /* SEPARATOR */
    let separator = "";
    if ((config.separator.enabled && config.separator.separators.length) || forceSeparator) {
      separator = randomChoice(config.separator.separators);
    }

    let combined = words.join(separator);

    /* CASING */
    if (config.casing.enabled && config.casing.modes.length) {
      const mode = randomChoice(config.casing.modes);

      if (mode === "lower") combined = combined.toLowerCase();

      if (mode === "camel") {
        combined = combined
          .split(separator)
          .map((w, i) =>
            i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)
          )
          .join(separator);
      }

      if (mode === "pascal") {
        combined = combined
          .split(separator)
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(separator);
      }
    }

    results.add(combined);
  }

  return Array.from(results);
}
