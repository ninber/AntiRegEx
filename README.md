

Anti-Regex Name Generator

Generate human-readable name variations that are difficult to detect or filter using simple regular expressions.

Designed for:
	•	Anti-scraping strategies
	•	Preventing automated website mention removal
	•	Avoiding naive pattern-based filtering
	•	Generating polymorphic brand mentions

This module produces structurally inconsistent variations of a base name while keeping them readable to humans.

⸻

✨ Features
	•	ES Module (native browser support)
	•	GitHub Pages compatible
	•	Fully configurable mutation pipeline
	•	Optional transformation steps
	•	Optional templates inside each step
	•	Returns 10 random variations by default
	•	Zero dependencies

⸻

🧠 How It Works

Instead of applying one predictable transformation (like camelCase → kebab-case), the generator uses structural polymorphism:
	•	Word shuffling
	•	Optional word dropping
	•	Optional duplication
	•	Character mutations
	•	Noise injection
	•	Random separators
	•	Random casing modes

Each output may differ in:
	•	Word count
	•	Word order
	•	Word mutation
	•	Separator usage
	•	Casing style

Because no stable structure exists, simple regex filters cannot reliably match outputs without explicit enumeration.

⸻

📦 Installation

No installation required.

Just copy antiRegexName.js into your project.

For GitHub Pages:

/your-project
 ├── index.html
 └── antiRegexName.js


⸻

🚀 Usage

Basic Example

<script type="module">
  import { generateVariants } from './antiRegexName.js';

  const results = generateVariants("mySuperWebSite");

  console.log(results);
</script>


⸻

⚙ Configuration

You can enable or disable any step.

generateVariants("mySuperWebSite", {
  template: {
    enabled: true,
    templates: ["shuffle", "reverse"]
  },
  mutation: {
    enabled: true,
    probability: 0.5,
    vowelSwap: true,
    doubleLetter: true,
    removeLetter: false,
    leet: true
  },
  noise: {
    enabled: true,
    probability: 0.4,
    words: ["hub", "zone", "online"]
  },
  separator: {
    enabled: true,
    separators: ["-", "_", ".", ""]
  },
  casing: {
    enabled: true,
    modes: ["camel", "pascal", "lower", "random"]
  },
  count: 10
});


⸻

🧩 Configuration Options

1️⃣ Template Step

Controls structural transformations.

Available templates:
	•	"shuffle" – random word order
	•	"dropOne" – removes one word
	•	"reverse" – reverses word order
	•	"duplicateOne" – duplicates a random word

⸻

2️⃣ Mutation Step

Character-level transformations.

Options:
	•	vowelSwap
	•	doubleLetter
	•	removeLetter
	•	leet

Each applied probabilistically.

⸻

3️⃣ Noise Injection

Adds neutral words to break structural predictability.

Example noise words:

["now", "maybe", "hub", "online", "zone"]


⸻

4️⃣ Separator Step

Randomly joins words using:

["-", "_", ".", "", ":"]


⸻

5️⃣ Casing Step

Modes:
	•	lower
	•	upper
	•	camel
	•	pascal
	•	random

⸻

📤 Output

Returns:

Array<string>

Default length: 10

Example output:

[
  "mySuperWeb",
  "super-webSite",
  "mysuuperweb",
  "webZoneMySuper",
  "myS0perWebNow",
  "super:webMy",
  "almostMyWeb",
  "webmysuper",
  "myWebHubSuper",
  "mysuperwebsite"
]

Each result is intentionally structurally inconsistent.

⸻

🛡 Why This Is Hard to Regex-Filter

Regex depends on:
	•	Stable word order
	•	Stable separators
	•	Stable casing
	•	Stable character classes
	•	Stable length patterns

This generator breaks all of those.

To filter reliably, a system would need:
	•	Full enumeration
	•	Semantic token detection
	•	Fuzzy matching
	•	NLP parsing

Simple pattern matching becomes ineffective.

⸻

🔧 Extending the Generator

You can enhance resistance further by adding:
	•	Synonym substitution
	•	Homoglyph injection
	•	Zero-width characters
	•	Character transposition
	•	Larger noise dictionaries
	•	Entropy scoring

⸻

⚠ Disclaimer

This tool is intended for legitimate anti-scraping and pattern-avoidance use cases.

Ensure you comply with platform rules, applicable laws, and ethical standards when deploying.

⸻

📄 License

MIT — free to use, modify, and distribute.

⸻

If you want, I can also generate:
	•	A demo page for GitHub Pages
	•	A visual playground UI
	•	A version with entropy scoring
	•	A CDN-friendly build
	•	NPM packaging configuration
