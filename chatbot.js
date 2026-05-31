// ════════════════════════════════════════════════════
//  RuleBot — Rule-Based Chatbot Engine
//  Demonstrates: pattern matching, if-else rules,
//  intent detection, and basic NLP concepts.
// ════════════════════════════════════════════════════

// ── 1. RULE DEFINITIONS ─────────────────────────────
// Each rule has:
//   patterns  — array of RegExp patterns to match user input
//   response  — function or string returning the bot reply
// Rules are checked IN ORDER; first match wins.

const RULES = [

  // ── Greetings ──────────────────────────────────────
  {
    intent: "greeting",
    patterns: [
      /\b(hi|hello|hey|howdy|greetings|good\s?(morning|evening|afternoon|day))\b/i
    ],
    responses: [
      "Hello there! 👋 How can I help you today?",
      "Hey! Great to see you. What's on your mind?",
      "Hi! I'm RuleBot. Ask me anything!"
    ]
  },

  // ── Farewells ──────────────────────────────────────
  {
    intent: "farewell",
    patterns: [
      /\b(bye|goodbye|see\s?you|take\s?care|later|farewell|exit|quit)\b/i
    ],
    responses: [
      "Goodbye! Have a wonderful day! 👋",
      "See you later! Feel free to come back anytime.",
      "Bye! It was nice chatting with you! 😊"
    ]
  },

  // ── How are you ────────────────────────────────────
  {
    intent: "wellbeing",
    patterns: [
      /how\s+are\s+you|how\s+do\s+you\s+do|you\s+okay|you\s+alright/i
    ],
    responses: [
      "I'm just a bot, but I'm running smoothly! 😄 How about you?",
      "All my rules are firing correctly — so I'm great! How can I help?"
    ]
  },

  // ── Name ───────────────────────────────────────────
  {
    intent: "name",
    patterns: [
      /what('?s|\s+is)\s+your\s+name|who\s+are\s+you/i
    ],
    responses: [
      "I'm <strong>RuleBot</strong> — a chatbot powered entirely by rules and pattern matching!",
      "My name is <strong>RuleBot</strong>. I respond using predefined patterns, no AI magic here!"
    ]
  },

  // ── Creator / Made by ──────────────────────────────
  {
    intent: "creator",
    patterns: [
      /who\s+(made|created|built|coded|programmed)\s+you|who('?s|\s+is)\s+your\s+(creator|maker|author)/i
    ],
    responses: [
      "I was built using vanilla JavaScript with rule-based pattern matching — a great way to learn NLP basics!",
    ]
  },

  // ── Math — addition ────────────────────────────────
  {
    intent: "math_add",
    patterns: [ /(\d+(\.\d+)?)\s*\+\s*(\d+(\.\d+)?)/ ],
    handler(input) {
      const m = input.match(/(\d+(\.\d+)?)\s*\+\s*(\d+(\.\d+)?)/);
      const result = parseFloat(m[1]) + parseFloat(m[3]);
      return `🔢 <code>${m[1]} + ${m[3]} = <strong>${result}</strong></code>`;
    }
  },

  // ── Math — subtraction ─────────────────────────────
  {
    intent: "math_sub",
    patterns: [ /(\d+(\.\d+)?)\s*-\s*(\d+(\.\d+)?)/ ],
    handler(input) {
      const m = input.match(/(\d+(\.\d+)?)\s*-\s*(\d+(\.\d+)?)/);
      const result = parseFloat(m[1]) - parseFloat(m[3]);
      return `🔢 <code>${m[1]} - ${m[3]} = <strong>${result}</strong></code>`;
    }
  },

  // ── Math — multiplication ──────────────────────────
  {
    intent: "math_mul",
    patterns: [ /(\d+(\.\d+)?)\s*[\*x×]\s*(\d+(\.\d+)?)/ ],
    handler(input) {
      const m = input.match(/(\d+(\.\d+)?)\s*[\*x×]\s*(\d+(\.\d+)?)/);
      const result = parseFloat(m[1]) * parseFloat(m[3]);
      return `🔢 <code>${m[1]} × ${m[3]} = <strong>${result}</strong></code>`;
    }
  },

  // ── Math — division ────────────────────────────────
  {
    intent: "math_div",
    patterns: [ /(\d+(\.\d+)?)\s*[\/÷]\s*(\d+(\.\d+)?)/ ],
    handler(input) {
      const m = input.match(/(\d+(\.\d+)?)\s*[\/÷]\s*(\d+(\.\d+)?)/);
      if (parseFloat(m[3]) === 0) return "⚠️ Division by zero is undefined!";
      const result = (parseFloat(m[1]) / parseFloat(m[3])).toFixed(4).replace(/\.?0+$/, "");
      return `🔢 <code>${m[1]} ÷ ${m[3]} = <strong>${result}</strong></code>`;
    }
  },

  // ── Math — square root ─────────────────────────────
  {
    intent: "math_sqrt",
    patterns: [ /sqrt\s*\(?\s*(\d+(\.\d+)?)\s*\)?|square\s+root\s+of\s+(\d+(\.\d+)?)/i ],
    handler(input) {
      const m = input.match(/sqrt\s*\(?\s*(\d+(\.\d+)?)\s*\)?|square\s+root\s+of\s+(\d+(\.\d+)?)/i);
      const n = parseFloat(m[1] || m[3]);
      if (n < 0) return "⚠️ Square root of a negative number is not real!";
      return `🔢 <code>√${n} = <strong>${Math.sqrt(n).toFixed(6).replace(/\.?0+$/, "")}</strong></code>`;
    }
  },

  // ── Time ───────────────────────────────────────────
  {
    intent: "time",
    patterns: [ /what('?s|\s+is)\s+(the\s+)?time|current\s+time|time\s+now/i ],
    handler() {
      const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      return `🕐 The current time is <strong>${t}</strong>.`;
    }
  },

  // ── Date ───────────────────────────────────────────
  {
    intent: "date",
    patterns: [ /what('?s|\s+is)\s+(the\s+)?date|today('?s|\s+is)|current\s+date/i ],
    handler() {
      const d = new Date().toLocaleDateString([], { weekday:"long", year:"numeric", month:"long", day:"numeric" });
      return `📅 Today is <strong>${d}</strong>.`;
    }
  },

  // ── Day of week ────────────────────────────────────
  {
    intent: "day",
    patterns: [ /what\s+day\s+is\s+(it|today)|which\s+day/i ],
    handler() {
      const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      return `📆 Today is <strong>${days[new Date().getDay()]}</strong>!`;
    }
  },

  // ── Jokes ──────────────────────────────────────────
  {
    intent: "joke",
    patterns: [ /tell\s+(me\s+)?a\s+joke|joke|make\s+me\s+laugh|funny/i ],
    handler() {
      const jokes = [
        "Why do programmers prefer dark mode? <br/>Because light attracts <strong>bugs</strong>! 🐛",
        "Why did the developer go broke? <br/>Because they used up all their <strong>cache</strong>! 💸",
        "How many programmers does it take to change a light bulb? <br/><strong>None</strong> — that's a hardware problem! 💡",
        "Why do Java developers wear glasses? <br/>Because they don't <strong>C#</strong>! 👓",
        "What do you call a bear with no teeth? <br/>A <strong>gummy bear</strong>! 🐻",
        "What's a computer's favourite snack? <br/><strong>Microchips</strong>! 🍟"
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }
  },

  // ── Capital city ───────────────────────────────────
  {
    intent: "capital",
    patterns: [ /capital\s+of\s+(\w+)/i ],
    handler(input) {
      const m = input.match(/capital\s+of\s+(\w+)/i);
      const capitals = {
        france:"Paris", germany:"Berlin", japan:"Tokyo", india:"New Delhi",
        usa:"Washington D.C.", uk:"London", australia:"Canberra",
        canada:"Ottawa", china:"Beijing", brazil:"Brasília",
        russia:"Moscow", italy:"Rome", spain:"Madrid",
        mexico:"Mexico City", argentina:"Buenos Aires"
      };
      const country = m[1].toLowerCase();
      return capitals[country]
        ? `🌍 The capital of <strong>${m[1]}</strong> is <strong>${capitals[country]}</strong>.`
        : `🤔 I don't know the capital of <strong>${m[1]}</strong>. Try a well-known country!`;
    }
  },

  // ── Programming language info ──────────────────────
  {
    intent: "lang_info",
    patterns: [ /what\s+is\s+(python|javascript|java|c\+\+|ruby|go|rust|php|swift|kotlin)/i ],
    handler(input) {
      const m = input.match(/what\s+is\s+(python|javascript|java|c\+\+|ruby|go|rust|php|swift|kotlin)/i);
      const info = {
        python:     "🐍 <strong>Python</strong> is a high-level, interpreted language known for simplicity. Great for AI, data science, and scripting.",
        javascript: "🌐 <strong>JavaScript</strong> is the language of the web, running in browsers and servers (Node.js). Dynamic and versatile.",
        java:       "☕ <strong>Java</strong> is a class-based, object-oriented language designed for portability — 'Write once, run anywhere.'",
        "c++":      "⚙️ <strong>C++</strong> is a powerful systems language offering both high-level abstractions and low-level memory control.",
        ruby:       "💎 <strong>Ruby</strong> is an expressive, developer-friendly language popularised by the Ruby on Rails web framework.",
        go:         "🐹 <strong>Go</strong> (Golang) is a statically typed language by Google, designed for simplicity and concurrency.",
        rust:       "🦀 <strong>Rust</strong> is a systems language focused on memory safety and performance without a garbage collector.",
        php:        "🐘 <strong>PHP</strong> is a server-side scripting language widely used for web development.",
        swift:      "🍎 <strong>Swift</strong> is Apple's modern language for iOS and macOS development.",
        kotlin:     "📱 <strong>Kotlin</strong> is a concise, safe language by JetBrains, now the preferred language for Android development."
      };
      return info[m[1].toLowerCase()] || "I know that's a programming language, but I don't have details!";
    }
  },

  // ── Favourite colour ───────────────────────────────
  {
    intent: "fav_color",
    patterns: [ /fav(ou?rite)?\s+colo(u?r)|what\s+colo(u?r)/i ],
    responses: [
      "My favourite colour is <strong style='color:#4f8ef7'>Electric Blue</strong> 💙 — it's the colour of my interface!",
    ]
  },

  // ── Age ────────────────────────────────────────────
  {
    intent: "age",
    patterns: [ /how\s+old\s+are\s+you|your\s+age|when\s+were\s+you\s+(made|created|born)/i ],
    responses: [
      "I was born the moment this page loaded! I reset every session — no memory, just rules. ⚡",
    ]
  },

  // ── Thanks ─────────────────────────────────────────
  {
    intent: "thanks",
    patterns: [ /thank(s|\s+you)|thx|cheers|much\s+appreciated/i ],
    responses: [
      "You're welcome! 😊 Anything else I can help with?",
      "Happy to help! Feel free to ask more questions.",
      "Anytime! That's what I'm here for. 🤖"
    ]
  },

  // ── Help ───────────────────────────────────────────
  {
    intent: "help",
    patterns: [ /\bhelp\b|what\s+can\s+you\s+do|capabilities|features/i ],
    responses: [
      `Here's what I can do:<br/><br/>
       🔢 <strong>Math</strong> — Try <code>12 + 7</code>, <code>sqrt(81)</code><br/>
       🌍 <strong>Capitals</strong> — Try <code>capital of Japan</code><br/>
       🕐 <strong>Time & Date</strong> — Try <code>what time is it?</code><br/>
       😂 <strong>Jokes</strong> — Try <code>tell me a joke</code><br/>
       💻 <strong>Languages</strong> — Try <code>what is Python?</code><br/>
       👋 <strong>Chit-chat</strong> — Greetings, farewells, and more!`
    ]
  },

  // ── Weather (limitation) ───────────────────────────
  {
    intent: "weather",
    patterns: [ /weather|temperature|forecast/i ],
    responses: [
      "🌤️ I'm a rule-based bot with no internet access, so I can't check live weather. Try a weather app!"
    ]
  },

  // ── News (limitation) ─────────────────────────────
  {
    intent: "news",
    patterns: [ /\bnews\b|latest|headlines/i ],
    responses: [
      "📰 I don't have access to live news — I only know what my rules contain! Try a news website."
    ]
  },
];

// ── 2. PATTERN MATCHER ─────────────────────────────
// Core NLP function: normalise input, test each rule's
// patterns, and return the matching rule (or null).

function matchIntent(input) {
  const normalised = input.trim().toLowerCase();
  for (const rule of RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(normalised) || pattern.test(input)) {
        return rule;
      }
    }
  }
  return null;
}

// ── 3. RESPONSE GENERATOR ──────────────────────────
// Given a matched rule, pick a response randomly (for
// variety) or call the handler function if defined.

function generateResponse(input) {
  const rule = matchIntent(input);
  if (!rule) return fallback(input);

  // If a handler exists, call it for dynamic responses
  if (typeof rule.handler === "function") {
    return rule.handler(input);
  }

  // Otherwise pick a random canned response
  const arr = rule.responses;
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── 4. FALLBACK HANDLER ────────────────────────────
// When no rule matches, try a graceful fallback.

function fallback(input) {
  const words = input.trim().split(/\s+/).length;

  if (words <= 1) {
    return `I don't understand "<strong>${input}</strong>". Try asking in a full sentence, or type <code>help</code> to see what I can do!`;
  }

  // Check for keywords to give a partial hint
  const hints = [
    { re: /\d/,         msg: "Looks like you're asking about numbers. Try an expression like <code>15 * 4</code>!" },
    { re: /who|what|where|when|why|how/i, msg: "That sounds like a question! I might not know the answer — type <code>help</code> to see my capabilities." },
  ];
  for (const h of hints) {
    if (h.re.test(input)) return h.msg;
  }

  return `🤔 I'm not sure how to respond to that. My rules don't cover it yet!<br/>Type <code>help</code> to see what I can do.`;
}

// ── 5. UI CONTROLLER ───────────────────────────────

const messagesEl = document.getElementById("messages");
const inputEl    = document.getElementById("userInput");

function appendMessage(html, type) {
  const msg    = document.createElement("div");
  msg.className = `msg ${type}`;

  const avatar = document.createElement("div");
  avatar.className = `avatar ${type === "bot" ? "bot-av" : "user-av"}`;
  avatar.textContent = type === "bot" ? "R" : "U";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML  = html;

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return msg;
}

function showTyping() {
  const msg    = document.createElement("div");
  msg.className = "msg bot typing";
  msg.id        = "typingIndicator";

  const avatar = document.createElement("div");
  avatar.className = "avatar bot-av";
  avatar.textContent = "R";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML  = `<div class="dot"></div><div class="dot"></div><div class="dot"></div>`;

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function hideTyping() {
  const t = document.getElementById("typingIndicator");
  if (t) t.remove();
}

function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;

  appendMessage(text, "user");
  inputEl.value = "";

  // Simulate a short "thinking" delay for realism
  showTyping();
  const delay = 400 + Math.random() * 500;
  setTimeout(() => {
    hideTyping();
    const response = generateResponse(text);
    appendMessage(response, "bot");
  }, delay);
}

function clearChat() {
  messagesEl.innerHTML = "";
  appendMessage("Chat cleared! 🧹 Ask me anything — type <code>help</code> to see what I can do.", "bot");
}

function fillInput(el) {
  inputEl.value = el.textContent;
  inputEl.focus();
}

// Autofocus input on load
window.addEventListener("load", () => inputEl.focus());
