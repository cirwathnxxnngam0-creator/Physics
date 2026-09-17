/**
 * test_content_math.js - Validates all mathematical LaTeX expressions across all 10 theories
 */
const katex = require('../vendor/katex/katex.min.js');
const tc = require('../js/data/physics_theories_content.js');

let totalDisplayChecked = 0;
let totalInlineChecked = 0;
let errors = [];

function checkMath(latex, isDisplay, loc) {
  try {
    katex.renderToString(latex, { displayMode: isDisplay, throwOnError: true });
    if (isDisplay) totalDisplayChecked++;
    else totalInlineChecked++;
  } catch (err) {
    errors.push({ loc, latex, err: err.message });
  }
}

function scanText(str, loc) {
  if (!str) return;

  // Display math $$...$$
  const dispRegex = /\$\$([\s\S]+?)\$\$/g;
  let match;
  while ((match = dispRegex.exec(str)) !== null) {
    checkMath(match[1], true, loc + ' (display)');
  }

  // Inline math $...$
  const cleanStr = str.replace(/\$\$([\s\S]+?)\$\$/g, '');
  const inlineRegex = /\$([^\$\n]+?)\$/g;
  while ((match = inlineRegex.exec(cleanStr)) !== null) {
    checkMath(match[1], false, loc + ' (inline)');
  }
}

console.log('Validating Divisions and Theories structure...');
console.log(`Found ${tc.divisions.length} divisions and ${tc.theories.length} theories.`);

tc.theories.forEach(t => {
  // Check formula display math
  t.formulas.forEach((f, idx) => {
    checkMath(f.latex, true, `Theory ${t.id} Formula ${idx + 1} (${f.name})`);
    if (f.symbols) {
      f.symbols.forEach(s => {
        checkMath(s.sym, false, `Theory ${t.id} Formula ${idx + 1} Symbol ${s.sym}`);
        if (s.unit && s.unit.includes('\\')) {
          checkMath(s.unit, false, `Theory ${t.id} Formula ${idx + 1} Unit ${s.unit}`);
        }
      });
    }
    if (f.derivationSteps) {
      f.derivationSteps.forEach((step, sIdx) => {
        scanText(step, `Theory ${t.id} Formula ${idx + 1} Derivation Step ${sIdx + 1}`);
      });
    }
  });

  // Check texts
  scanText(t.definition.text, `Theory ${t.id} Definition`);
  scanText(t.principle.text, `Theory ${t.id} Principle`);
  scanText(t.application.text, `Theory ${t.id} Application text`);
  scanText(t.application.validWhen, `Theory ${t.id} Application validWhen`);
  scanText(t.application.invalidWhen, `Theory ${t.id} Application invalidWhen`);
  scanText(t.example.problem, `Theory ${t.id} Example problem`);
  t.example.steps.forEach((st, idx) => {
    scanText(st, `Theory ${t.id} Example step ${idx + 1}`);
  });
  if (t.example.diagramCaption) {
    scanText(t.example.diagramCaption, `Theory ${t.id} Diagram Caption`);
  }
  if (t.citation) {
    scanText(t.citation, `Theory ${t.id} Citation`);
  }
  if (t.observations) {
    t.observations.forEach((obs, idx) => {
      scanText(obs, `Theory ${t.id} Observation ${idx + 1}`);
    });
  }
});

if (tc.masterSymbols) {
  console.log(`Validating ${tc.masterSymbols.length} master symbols and notes...`);
  tc.masterSymbols.forEach((s, idx) => {
    checkMath(s.sym, false, `MasterSymbol ${idx + 1} (${s.nameTh}) sym`);
    checkMath(s.unit, false, `MasterSymbol ${idx + 1} (${s.nameTh}) unit`);
    if (s.note) {
      scanText(s.note, `MasterSymbol ${idx + 1} (${s.nameTh}) note`);
    }
  });
}

const proj = require('../js/data/projectile_content.js');
if (proj.workedExample) {
  console.log('Validating Benchmark Worked Example...');
  if (proj.workedExample.comparisonMetrics) {
    proj.workedExample.comparisonMetrics.forEach(m => {
      scanText(m.label, 'Worked Example Metric Label');
      scanText(m.effect, 'Worked Example Metric Effect');
    });
  }
  if (proj.workedExample.steps) {
    proj.workedExample.steps.forEach(s => {
      if (s.formula) checkMath(s.formula, true, `Worked Example Step ${s.step} formula`);
      if (s.calc) scanText(s.calc, `Worked Example Step ${s.step} calc`);
    });
  }
}

const af = require('../js/data/analytical_formalisms_content.js');
if (af && af.topics) {
  console.log(`Validating Analytical Formalisms (${af.topics.length} topics)...`);
  if (af.comparisonTable && af.comparisonTable.rows) {
    af.comparisonTable.rows.forEach(r => {
      scanText(r.newton, `AF Table ${r.aspect} newton`);
      scanText(r.lagrange, `AF Table ${r.aspect} lagrange`);
      scanText(r.hamilton, `AF Table ${r.aspect} hamilton`);
    });
  }
  af.topics.forEach(top => {
    checkMath(top.displayFormula, true, `AF ${top.id} Display Formula`);
    scanText(top.coreConcept, `AF ${top.id} Core Concept`);
    if (top.derivation) {
      top.derivation.forEach((d, dIdx) => {
        scanText(d, `AF ${top.id} Derivation ${dIdx + 1}`);
      });
    }
    if (top.takeaways) {
      top.takeaways.forEach((t, tIdx) => {
        scanText(t, `AF ${top.id} Takeaway ${tIdx + 1}`);
      });
    }
  });
}

console.log(`Total display formulas checked: ${totalDisplayChecked}`);
console.log(`Total inline math expressions checked: ${totalInlineChecked}`);
console.log(`Total errors: ${errors.length}`);

if (errors.length > 0) {
  console.error('\nErrors encountered:');
  errors.forEach(e => {
    console.error(`- [${e.loc}]: "${e.latex}" -> ${e.err}`);
  });
  process.exit(1);
} else {
  console.log('\nALL MATH EXPRESSIONS VALIDATED SUCCESSFULLY WITH LOCAL KATEX!');
}
