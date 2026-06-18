#!/usr/bin/env node
/**
 * demo.js — fun, paste-ready examples for the Shopify Editions Spring '26 MCP.
 * Renders REAL output from lib.js dispatch() (no faking) as a tidy terminal card,
 * so it reads like an agent asking the MCP a question and getting an answer back.
 *
 *   node demo.js              # list the scenarios
 *   node demo.js customers    # run one
 *   node demo.js all          # run them all (used by the GIF tape)
 */
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { dispatch } from "./lib.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(join(HERE, "dataset.json"), "utf8"));
const D = { ITEMS: data.items, META: data.meta || data };

// ── tiny ANSI helpers ───────────────────────────────────────────────
const c = (n, s) => `\x1b[${n}m${s}\x1b[0m`;
const dim = (s) => c("2", s), bold = (s) => c("1", s);
const green = (s) => c("32", s), cyan = (s) => c("36", s);
const yellow = (s) => c("33", s), magenta = (s) => c("35", s);
const wrap = (s, w = 76) => {
  const out = [];
  for (const para of String(s).split("\n")) {
    let line = "";
    for (const word of para.split(" ")) {
      if ((line + word).length > w) { out.push(line.trimEnd()); line = ""; }
      line += word + " ";
    }
    out.push(line.trimEnd());
  }
  return out;
};

function card(question, tool, render) {
  console.log("");
  console.log(cyan("🧑  ") + bold(question));
  console.log(dim("    └─ mcp tool: ") + magenta(tool));
  console.log(green("🤖  shopify-editions answers:"));
  console.log(dim("    " + "─".repeat(72)));
  for (const line of render()) console.log("    " + line);
  console.log("");
}

// ── source-modality classifier (the heart of "doc-teaming") ─────────
// Cluster a feature's sources by the KIND of doc they are, so one claim
// is corroborated across video + agent docs + engineering + marketing —
// and marketing is labelled as a claim, never counted as proof.
const MODALITY = {
  video:         { icon: "🎥", label: "Video",          proof: true  },
  dev_docs:      { icon: "🛠️", label: "Dev / agent docs", proof: true  },
  engineering:   { icon: "🔧", label: "Engineering",     proof: true  },
  help_center:   { icon: "📖", label: "Human docs",      proof: true  },
  docs:          { icon: "📖", label: "Human docs",      proof: true  },
  changelog:     { icon: "🧾", label: "Changelog",       proof: true  },
  news:          { icon: "📰", label: "Press",           proof: true  },
  editions_page: { icon: "📣", label: "Marketing",       proof: false },
  marketing:     { icon: "📣", label: "Marketing",       proof: false },
};
const modOf = (t) => MODALITY[t] || { icon: "•", label: t || "other", proof: true };

// ── scenarios (the fun examples) ────────────────────────────────────
const SCENARIOS = {
  // Compact, chrome-free render for a still image (LinkedIn in-feed).
  card_still: () => {
    const it = dispatch("get", { id: "ucp_protocol" }, D);
    const sc = it.shopify_claim || {};
    const short = (u) => { let s = u.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, ""); return s.length > 40 ? s.slice(0, 39) + "…" : s; };
    console.log("");
    console.log(bold("  doc-teaming — one claim, every doc surface:  ") + bold(it.name) + dim(`  [${sc.availability}]`));
    console.log("");
    for (const s of sc.sources || []) {
      const m = modOf(s.type);
      const tag = m.proof ? green(" proof ") : yellow(" claim ");
      const ts = s.timestamp ? dim(` @${s.timestamp}`) : "";
      console.log(`    ${m.icon} ${bold(m.label.padEnd(16))}${tag} ${dim(short(s.url))}${ts}`);
    }
    const proof = (sc.sources || []).filter((s) => modOf(s.type).proof).length;
    console.log("");
    console.log(green(`  ✓ shipped: `) + `${proof} primary sources agree` + dim("   ·   ") +
      yellow(`📣 marketing flagged, not counted as proof`));
    console.log("");
  },

  doc_teaming: () => card(
    'Is UCP real, or marketing? Show me every source — by kind.',
    'get {id:"ucp_protocol"}  →  cross-linked by modality',
    () => {
      const it = dispatch("get", { id: "ucp_protocol" }, D);
      const sc = it.shopify_claim || {};
      const out = [bold(it.name) + dim(`  [${sc.availability}]`), ""];
      out.push(dim("One claim, teamed across every doc surface:"));
      const short = (u) => {
        let s = u.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
        return s.length > 40 ? s.slice(0, 39) + "…" : s;
      };
      for (const s of sc.sources || []) {
        const m = modOf(s.type);
        const tag = m.proof ? green(" proof ") : yellow(" claim ");
        const ts = s.timestamp ? dim(` @${s.timestamp}`) : "";
        out.push(`  ${m.icon} ${bold(m.label.padEnd(16))}${tag} ${dim(short(s.url))}${ts}`);
      }
      const proof = (sc.sources || []).filter((s) => modOf(s.type).proof).length;
      const mkt = (sc.sources || []).length - proof;
      out.push("");
      out.push(green(`✓ shipped: `) + `${proof} primary sources agree` +
        dim("   ·   ") + yellow(`📣 ${mkt} marketing claim`) + dim(" (flagged, not counted)"));
      if (sc.caveats?.[0]) {
        out.push("", magenta("red-team flag:"));
        wrap(sc.caveats[0]).forEach((l) => out.push("  " + dim(l)));
      }
      return out;
    }
  ),

  customers: () => card(
    "Which merchants did Shopify actually show off — and what's missing?",
    "customers",
    () => {
      const r = dispatch("customers", {}, D);
      const out = [];
      for (const p of r.merchant_proof.slice(0, 4))
        out.push(green("• ") + bold(p.merchant) + dim(p.verifiable ? "  ✓ verifiable" : "  ✗ unsourced"));
      out.push(dim(`  …${r.merchant_proof.length - 4} more`), "");
      out.push(yellow("Rick's read:"));
      wrap(r.verdict).forEach((l) => out.push("  " + l));
      return out;
    }
  ),

  deprecations: () => card(
    "What did Shopify deprecate, and when's the deadline?",
    "deprecations",
    () => {
      const r = dispatch("deprecations", {}, D);
      const out = [];
      for (const it of r.items.slice(0, 5)) {
        out.push(green("• ") + bold(it.name) + dim(`  [${it.availability}]`));
        const dl = it.migration?.deadline, path = it.migration?.path;
        if (dl) out.push(dim("    deadline: ") + yellow(dl) + (path ? dim("  →  " + path) : ""));
      }
      out.push("", dim(`${r.items.length} breaking/deprecated changes tracked.`));
      return out;
    }
  ),

  unreleased: () => card(
    "What's announced but NOT actually shipped yet?",
    "unreleased",
    () => {
      const r = dispatch("unreleased", {}, D);
      const idx = r.index || {};
      const out = [bold("The vaporware filter — announced ≠ available:")];
      for (const [k, v] of Object.entries(idx)) {
        if (Array.isArray(v)) out.push(green("• ") + bold(`${v.length}`) + " " + k.replace(/_/g, " "));
        else if (typeof v === "number") out.push(green("• ") + bold(`${v}`) + " " + k.replace(/_/g, " "));
      }
      out.push("", dim(r.note));
      return out;
    }
  ),

  agentic: () => card(
    "What's new in agentic commerce this Edition?",
    'query {domain:"agentic"}',
    () => {
      const r = dispatch("query", { domain: "agentic" }, D);
      const out = [bold(`${r.count} changes`) + dim(" in the agentic domain. Top of the list:")];
      for (const it of r.items.slice(0, 6))
        out.push(green("• ") + bold(it.name) + dim(`  [${it.availability}]`));
      out.push(dim(`  …${r.count - 6} more — drill in with get {id:"…"}`));
      return out;
    }
  ),

  will_it_ship: () => card(
    'Meta ads checkout sounds big — will it actually ship?',
    'easter {name:"will_it_ship", id:"meta_ads_checkout"}',
    () => {
      const r = dispatch("easter", { name: "will_it_ship", id: "meta_ads_checkout" }, D);
      const out = [
        bold(r.name) + dim(`  [${r.availability}]`),
        green("ships likelihood: ") + yellow(r.ship_likelihood) + dim("   check back: ") + r.check_back,
        "",
      ];
      wrap(r.track_record).forEach((l) => out.push(dim(l)));
      return out;
    }
  ),

  hype_translator: () => card(
    "Translate Shopify's launch hype into plain English",
    'easter {name:"hype_translator"}',
    () => {
      const r = dispatch("easter", { name: "hype_translator" }, D);
      return [
        bold("Rule: ") + r.rule,
        "",
        yellow("Banned buzzwords it strips out:"),
        ...wrap(r.banned.map((b) => `“${b}”`).join("   ")),
      ];
    }
  ),

  whoami: () => card(
    "...wait, what am I even talking to?",
    'easter {name:"whoami"}',
    () => {
      const r = dispatch("easter", { name: "whoami" }, D);
      return [...wrap(r.wink), "", dim(`edition: ${r.edition}   ·   ${r.items} changes catalogued`)];
    }
  ),
};

const ORDER = ["doc_teaming", "customers", "deprecations", "unreleased", "agentic", "will_it_ship", "hype_translator", "whoami"];

// ── entry ───────────────────────────────────────────────────────────
const arg = process.argv[2];
if (!arg) {
  console.log(bold("\nShopify Editions Spring '26 MCP — fun examples\n"));
  console.log("  " + dim("node demo.js <name>") + "   or   " + dim("node demo.js all\n"));
  for (const k of ORDER) console.log("  " + green("•") + " " + k);
  console.log("");
} else if (arg === "all") {
  for (const k of ORDER) SCENARIOS[k]();
} else if (SCENARIOS[arg]) {
  SCENARIOS[arg]();
} else {
  console.error(`unknown scenario "${arg}". try: ${ORDER.join(", ")}`);
  process.exit(1);
}
