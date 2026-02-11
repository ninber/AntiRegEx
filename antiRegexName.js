// antiRegexName.js
// ES Module — GitHub Pages compatible

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

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function mutateWord(word, config) {
  if (!config.enabled) return word;

  let w = word;

  if (config.vowelSwap && maybe(config.probability)) {
    w = w.replace(/[aeiou]/, v =>
      randomChoice(["a", "e", "i", "o", "u"])
    );
  }

  if (config.doubleLetter && maybe(config.probability)) {
    const i = Math.floor(Math.random() * w.length);
    w = w.slice(0, i) + w[i] + w.slice(i);
  }

  if (config.removeLetter && maybe(config.probability)) {
    const i = Math.floor(Math.random() * w.length);
    w = w.slice(0, i) + w.slice(i + 1);
  }

  if (config.leet && maybe(config.probability)) {
    w = w.replace(/o/g, "0").replace(/e/g, "3");
  }

  return w;
}

function applyCasing(words, config) {
  if (!config.enabled) return words.join("");

  const mode = randomChoice(config.modes);

  switch (mode) {
    case "lower":
      return words.join("").toLowerCase();
    case "upper":
      return words.join("").toUpperCase();
    case "camel":
      return words
        .map((w, i) =>
          i === 0 ? w : w[0].toUpperCase() + w.slice(1)
        )
        .join("");
    case "pascal":
      return words
        .map(w => w[0].toUpperCase() + w.slice(1))
        .join("");
    case "random":
      return words
        .join("")
        .split("")
        .map(c =>
          maybe(0.5) ? c.toUpperCase() : c.toLowerCase()
        )
        .join("");
    default:
      return words.join("");
  }
}

function applySeparator(words, config) {
  if (!config.enabled) return words;

  const sep = randomChoice(config.separators);
  return words.join(sep);
}

function injectNoise(words, config) {
  if (!config.enabled) return words;

  if (!maybe(config.probability)) return words;

  const noise = randomChoice(config.words);

  const position = Math.floor(Math.random() * (words.length + 1));
  const newWords = [...words];
  newWords.splice(position, 0, noise);

  return newWords;
}

function applyTemplate(words, config) {
  if (!config.enabled) return words;

  const template = randomChoice(config.templates);

  switch (template) {
    case "shuffle":
      return shuffle(words);
    case "dropOne":
      if (words.length > 1) {
        const i = Math.floor(Math.random() * words.length);
        return words.filter((_, idx) => idx !== i);
      }
      return words;
    case "reverse":
      return [...words].reverse();
    case "duplicateOne":
      const i = Math.floor(Math.random() * words.length);
      return [...words, words[i]];
    default:
      return words;
  }
}

export function generateVariants(input, userConfig = {}) {
  const defaultConfig = {
    template: {
      enabled: true,
      templates: ["shuffle", "dropOne", "reverse", "duplicateOne"]
    },
    mutation: {
      enabled: true,
      probability: 0.4,
      vowelSwap: true,
      doubleLetter: true,
      removeLetter: false,
      leet: false
    },
    noise: {
      enabled: true,
      probability: 0.4,
      words: ["now", "maybe", "hub", "online", "zone", "base"]
    },
    separator: {
      enabled: true,
      separators: ["-", "_", ".", "", ":"]
    },
    casing: {
      enabled: true,
      modes: ["camel", "pascal", "lower", "random"]
    },
    count: 10
  };

  const config = { ...defaultConfig, ...userConfig };

  const baseWords = splitCamelCase(input);

  const results = new Set();

  while (results.size < config.count) {
    let words = [...baseWords];

    words = applyTemplate(words, config.template);

    words = words.map(w => mutateWord(w, config.mutation));

    words = injectNoise(words, config.noise);

    const separated = applySeparator(words, config.separator);

    const final = applyCasing(
      separated.split(/[-_.:]/),
      config.casing
    );

    results.add(final);
  }

  return Array.from(results);
}
