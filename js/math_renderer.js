/**
 * math_renderer.js - Client-Side Math Typesetter using Local KaTeX Engine
 * Part of PhysicsNoza 3.0 Architecture
 *
 * Primary: Uses locally bundled KaTeX (vendor/katex/katex.min.js) for full standard LaTeX rendering.
 * Fallback: Pure JavaScript balanced-brace parser if KaTeX is unavailable.
 * Completely offline, zero CDN dependency, MIT Licensed.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MathRenderer = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function getKaTeX() {
    if (typeof window !== 'undefined' && window.katex) {
      return window.katex;
    }
    if (typeof global !== 'undefined' && global.katex) {
      return global.katex;
    }
    try {
      return require('../vendor/katex/katex.min.js');
    } catch (e) {
      return null;
    }
  }

  /**
   * Helper to find matching closing brace in string starting at openPos
   */
  function findMatchingBrace(str, openPos) {
    let depth = 1;
    for (let i = openPos + 1; i < str.length; i++) {
      if (str[i] === '{') depth++;
      else if (str[i] === '}') {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  /**
   * Fallback pure JS renderer if KaTeX is absent
   */
  function fallbackRenderLatex(latex) {
    if (!latex) return '';
    let s = latex.trim();

    s = s.replace(/\\left\s*([(\[{|.\\])/g, '$1');
    s = s.replace(/\\right\s*([)\]}|.\\])/g, '$1');

    while (s.includes('\\text{')) {
      const idx = s.indexOf('\\text{');
      const closeIdx = findMatchingBrace(s, idx + 5);
      if (closeIdx === -1) break;
      const textContent = s.substring(idx + 6, closeIdx);
      s = s.substring(0, idx) + '<span class="math-text">' + textContent + '</span>' + s.substring(closeIdx + 1);
    }

    while (s.includes('\\frac')) {
      const fracIdx = s.indexOf('\\frac');
      const openNum = s.indexOf('{', fracIdx);
      if (openNum === -1) break;
      const closeNum = findMatchingBrace(s, openNum);
      if (closeNum === -1) break;
      const openDen = s.indexOf('{', closeNum + 1);
      if (openDen === -1) break;
      const closeDen = findMatchingBrace(s, openDen);
      if (closeDen === -1) break;

      const num = s.substring(openNum + 1, closeNum);
      const den = s.substring(openDen + 1, closeDen);
      s = s.substring(0, fracIdx) + '<span class="math-frac"><span class="math-num">' + fallbackRenderLatex(num) + '</span><span class="math-den">' + fallbackRenderLatex(den) + '</span></span>' + s.substring(closeDen + 1);
    }

    while (s.includes('\\sqrt{')) {
      const sqrtIdx = s.indexOf('\\sqrt{');
      const closeIdx = findMatchingBrace(s, sqrtIdx + 5);
      if (closeIdx === -1) break;
      const arg = s.substring(sqrtIdx + 6, closeIdx);
      s = s.substring(0, sqrtIdx) + '<span class="math-sqrt"><span class="math-radicand">&radic;(' + fallbackRenderLatex(arg) + ')</span></span>' + s.substring(closeIdx + 1);
    }

    while (s.includes('\\mathbf{')) {
      const bIdx = s.indexOf('\\mathbf{');
      const closeIdx = findMatchingBrace(s, bIdx + 7);
      if (closeIdx === -1) break;
      const content = s.substring(bIdx + 8, closeIdx);
      s = s.substring(0, bIdx) + '<strong class="math-bold">' + fallbackRenderLatex(content) + '</strong>' + s.substring(closeIdx + 1);
    }

    while (s.includes('\\vec{')) {
      const vIdx = s.indexOf('\\vec{');
      const closeIdx = findMatchingBrace(s, vIdx + 4);
      if (closeIdx === -1) break;
      const content = s.substring(vIdx + 5, closeIdx);
      s = s.substring(0, vIdx) + '<span class="math-vec"><span class="vec-arrow">&rarr;</span><span class="vec-body">' + fallbackRenderLatex(content) + '</span></span>' + s.substring(closeIdx + 1);
    }

    const functions = ['sin', 'cos', 'tan', 'arcsin', 'arccos', 'arctan', 'ln', 'log', 'exp', 'lim'];
    functions.forEach(fn => {
      const reg = new RegExp('\\\\' + fn + '(?![a-zA-Z])', 'g');
      s = s.replace(reg, '<span class="math-fn">' + fn + '</span>');
    });

    s = s.replace(/\\cdot/g, '&sdot;').replace(/\\times/g, '&times;').replace(/\\pm/g, '&plusmn;');
    s = s.replace(/\\leq/g, '&le;').replace(/\\geq/g, '&ge;').replace(/\\neq/g, '&ne;').replace(/\\approx/g, '&asymp;');
    s = s.replace(/\\implies/g, '&rArr;').replace(/\\to/g, '&rarr;').replace(/\\in/g, '&isin;');
    s = s.replace(/\\Delta/g, '&Delta;').replace(/\\theta/g, '&theta;').replace(/\\alpha/g, '&alpha;');
    s = s.replace(/\\tau/g, '&tau;').replace(/\\omega/g, '&omega;').replace(/\\pi/g, '&pi;');
    s = s.replace(/\\sum/g, '&sum;').replace(/\\int/g, '&int;');

    while (s.includes('^{')) {
      const supIdx = s.indexOf('^{');
      const closeIdx = findMatchingBrace(s, supIdx + 1);
      if (closeIdx === -1) break;
      const content = s.substring(supIdx + 2, closeIdx);
      s = s.substring(0, supIdx) + '<sup>' + fallbackRenderLatex(content) + '</sup>' + s.substring(closeIdx + 1);
    }
    s = s.replace(/\^([0-9a-zA-Z+-])/g, '<sup>$1</sup>');

    while (s.includes('_{')) {
      const subIdx = s.indexOf('_{');
      const closeIdx = findMatchingBrace(s, subIdx + 1);
      if (closeIdx === -1) break;
      const content = s.substring(subIdx + 2, closeIdx);
      s = s.substring(0, subIdx) + '<sub>' + fallbackRenderLatex(content) + '</sub>' + s.substring(closeIdx + 1);
    }
    s = s.replace(/_([0-9a-zA-Z])/g, '<sub>$1</sub>');

    return s;
  }

  /**
   * Renders LaTeX expression using KaTeX if available, or fallback
   */
  function renderLatex(latex, isDisplay = false) {
    if (!latex) return '';
    const katexInst = getKaTeX();
    if (katexInst) {
      try {
        return katexInst.renderToString(latex, {
          displayMode: isDisplay,
          throwOnError: false
        });
      } catch (e) {
        console.warn('KaTeX render error, using fallback:', e);
      }
    }
    return fallbackRenderLatex(latex);
  }

  const LATEX_COMMANDS = [
    'frac', 'sqrt', 'mathbf', 'mathrm', 'text', 'vec', 'hat', 'dot', 'ddot',
    'sum', 'int', 'oint', 'prod', 'lim',
    'varepsilon', 'mathcal', 'partial', 'times', 'cdot', 'approx', 'pm', 'mp',
    'leq', 'geq', 'neq', 'implies', 'to', 'in', 'alpha', 'beta', 'gamma', 'Delta',
    'delta', 'epsilon', 'zeta', 'eta', 'theta', 'Theta', 'iota', 'kappa', 'lambda',
    'Lambda', 'mu', 'nu', 'xi', 'Xi', 'pi', 'rho', 'sigma', 'Sigma', 'tau',
    'upsilon', 'phi', 'Phi', 'chi', 'psi', 'Psi', 'omega', 'Omega', 'nabla', 'hbar',
    'left', 'right', 'langle', 'rangle', 'exp', 'sin', 'cos', 'tan', 'ln', 'log', 'quad', 'qquad'
  ];

  /**
   * Automatically detects and wraps unbracketed LaTeX expressions with $...$
   */
  function autoDetectAndWrapLatex(text) {
    if (!text || typeof text !== 'string') return text;
    
    let hasCmd = false;
    for (let c = 0; c < LATEX_COMMANDS.length; c++) {
      if (text.indexOf('\\' + LATEX_COMMANDS[c]) !== -1) {
        hasCmd = true;
        break;
      }
    }
    if (!hasCmd) return text;

    const tokens = text.split(/(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$)/);
    const katexInst = getKaTeX();

    for (let t = 0; t < tokens.length; t++) {
      if (tokens[t].startsWith('$')) continue;
      let s = tokens[t];
      let i = 0;
      while (i < s.length) {
        if (s[i] === '\\') {
          const rest = s.substring(i + 1);
          const matchCmd = rest.match(/^[a-zA-Z]+/);
          if (matchCmd && LATEX_COMMANDS.indexOf(matchCmd[0]) !== -1) {
            let startPos = i;
            while (startPos > 0) {
              const prevChar = s[startPos - 1];
              if (/[\u0E00-\u0E7F\n$]/.test(prevChar)) break;
              if ((prevChar === ':' || prevChar === ';') && startPos > 1 && /[\u0E00-\u0E7F\s]/.test(s[startPos - 2])) break;
              if (prevChar === '•') break;
              startPos--;
            }
            while (startPos < i && /\s/.test(s[startPos])) startPos++;

            let endPos = i + 1 + matchCmd[0].length;
            while (endPos < s.length) {
              const ch = s[endPos];
              if (/[\u0E00-\u0E7F\n$]/.test(ch)) break;
              if (ch === '{') {
                const closeIdx = findMatchingBrace(s, endPos);
                if (closeIdx !== -1) {
                  endPos = closeIdx + 1;
                  continue;
                }
              }
              endPos++;
            }

            let candidate = s.substring(startPos, endPos).trim();

            while (candidate.length > 0 && /[.,;:!]$/.test(candidate)) {
              candidate = candidate.slice(0, -1).trim();
              endPos--;
            }

            // Ensure balanced braces { }
            let openB = (candidate.match(/{/g) || []).length;
            let closeB = (candidate.match(/}/g) || []).length;
            while (closeB < openB && endPos < s.length && !/[\u0E00-\u0E7F\n$]/.test(s[endPos])) {
              candidate += s[endPos];
              if (s[endPos] === '}') closeB++;
              endPos++;
            }

            // Ensure balanced parentheses ( )
            let openP = (candidate.match(/\(/g) || []).length;
            let closeP = (candidate.match(/\)/g) || []).length;
            while (closeP < openP && endPos < s.length && !/[\u0E00-\u0E7F\n$]/.test(s[endPos])) {
              candidate += s[endPos];
              if (s[endPos] === ')') closeP++;
              endPos++;
            }

            if (/\\right\s*$/.test(candidate) && endPos < s.length && /[)\]}|.]/.test(s[endPos])) {
              candidate += s[endPos];
              endPos++;
            }

            candidate = candidate.trim();

            if (candidate.length > 0) {
              let canParse = true;
              if (katexInst) {
                try {
                  katexInst.renderToString(candidate, { throwOnError: true });
                } catch (e) {
                  canParse = false;
                }
              }

              if (canParse) {
                const before = s.substring(0, startPos);
                const after = s.substring(endPos);
                s = before + '$' + candidate + '$' + after;
                i = startPos + candidate.length + 2;
                continue;
              }
            }
          }
        }
        i++;
      }
      tokens[t] = s;
    }
    return tokens.join('');
  }

  /**
   * Helper to format a string containing math (with auto-wrap + KaTeX rendering)
   */
  function renderMathText(text) {
    if (!text) return '';
    let prepared = autoDetectAndWrapLatex(text);
    
    // Display math
    prepared = prepared.replace(/\$\$([\s\S]+?)\$\$/g, function (_, math) {
      return '<div class="math-container display-math">' + renderLatex(math, true) + '</div>';
    });
    prepared = prepared.replace(/\\\[([\s\S]+?)\\\]/g, function (_, math) {
      return '<div class="math-container display-math">' + renderLatex(math, true) + '</div>';
    });

    // Inline math
    prepared = prepared.replace(/\$([^\$\n]+?)\$/g, function (_, math) {
      return '<span class="inline-math">' + renderLatex(math, false) + '</span>';
    });
    prepared = prepared.replace(/\\\(([\s\S]+?)\\\)/g, function (_, math) {
      return '<span class="inline-math">' + renderLatex(math, false) + '</span>';
    });

    return prepared;
  }

  /**
   * Typesets all inline and display math elements in a given DOM container
   */
  function typeset(element) {
    if (!element) return;
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (parent.closest('.katex, .katex-html, .katex-mathml, script, style, textarea, code, .math-rendered-block')) {
            return NodeFilter.FILTER_REJECT;
          }
          const val = node.nodeValue;
          if (!val) return NodeFilter.FILTER_REJECT;
          const hasMathDelim = val.includes('$') || val.includes('\\[') || val.includes('\\(');
          if (hasMathDelim) return NodeFilter.FILTER_ACCEPT;
          if (val.includes('\\')) {
            for (let c = 0; c < LATEX_COMMANDS.length; c++) {
              if (val.indexOf('\\' + LATEX_COMMANDS[c]) !== -1) {
                return NodeFilter.FILTER_ACCEPT;
              }
            }
          }
          return NodeFilter.FILTER_REJECT;
        }
      },
      false
    );

    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    textNodes.forEach(tNode => {
      const text = tNode.nodeValue;
      let replaced = autoDetectAndWrapLatex(text);

      // Display math $$...$$ or \[...\]
      replaced = replaced.replace(/\$\$([\s\S]+?)\$\$/g, function (_, math) {
        return '<div class="math-container display-math">' + renderLatex(math, true) + '</div>';
      });
      replaced = replaced.replace(/\\\[([\s\S]+?)\\\]/g, function (_, math) {
        return '<div class="math-container display-math">' + renderLatex(math, true) + '</div>';
      });

      // Inline math $...$ or \(...\)
      replaced = replaced.replace(/\$([^\$\n]+?)\$/g, function (_, math) {
        return '<span class="inline-math">' + renderLatex(math, false) + '</span>';
      });
      replaced = replaced.replace(/\\\(([\s\S]+?)\\\)/g, function (_, math) {
        return '<span class="inline-math">' + renderLatex(math, false) + '</span>';
      });

      if (replaced !== text) {
        const span = document.createElement('span');
        span.className = 'math-rendered-block';
        span.innerHTML = replaced;
        if (tNode.parentNode) {
          tNode.parentNode.replaceChild(span, tNode);
        }
      }
    });
  }

  return {
    renderLatex,
    typeset,
    autoDetectAndWrapLatex,
    renderMathText
  };
}));
