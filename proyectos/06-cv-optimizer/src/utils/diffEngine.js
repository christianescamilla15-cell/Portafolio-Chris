// ─────────────────────────────────────────────
// DIFF ENGINE — Simple line-level diff using LCS
// ─────────────────────────────────────────────

/**
 * Compute the Longest Common Subsequence table for two arrays of lines.
 * Returns a 2D array where lcs[i][j] = length of LCS of a[0..i-1] and b[0..j-1].
 */
function buildLCSTable(a, b) {
  const m = a.length;
  const n = b.length;
  const table = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        table[i][j] = table[i - 1][j - 1] + 1;
      } else {
        table[i][j] = Math.max(table[i - 1][j], table[i][j - 1]);
      }
    }
  }
  return table;
}

/**
 * Backtrack through the LCS table to produce a diff result.
 * Returns array of { type, original, optimized } where type is:
 *   'unchanged' — line is the same in both
 *   'removed'   — line only in original
 *   'added'     — line only in optimized
 *   'modified'  — line changed between original and optimized
 */
function backtrackDiff(a, b, table) {
  const result = [];
  let i = a.length;
  let j = b.length;

  // Collect operations in reverse, then flip
  const ops = [];
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      ops.push({ type: 'unchanged', original: a[i - 1], optimized: b[j - 1] });
      i--;
      j--;
    } else if (table[i - 1][j] >= table[i][j - 1]) {
      ops.push({ type: 'removed', original: a[i - 1], optimized: null });
      i--;
    } else {
      ops.push({ type: 'added', original: null, optimized: b[j - 1] });
      j--;
    }
  }
  while (i > 0) {
    ops.push({ type: 'removed', original: a[i - 1], optimized: null });
    i--;
  }
  while (j > 0) {
    ops.push({ type: 'added', original: null, optimized: b[j - 1] });
    j--;
  }

  ops.reverse();

  // Post-process: merge adjacent removed+added pairs into 'modified'
  for (let k = 0; k < ops.length; k++) {
    if (
      k < ops.length - 1 &&
      ops[k].type === 'removed' &&
      ops[k + 1].type === 'added'
    ) {
      result.push({
        type: 'modified',
        original: ops[k].original,
        optimized: ops[k + 1].optimized,
      });
      k++; // skip the next 'added'
    } else {
      result.push(ops[k]);
    }
  }

  return result;
}

/**
 * Compute a line-level diff between original and optimized text.
 * @param {string[]} originalLines - array of lines from original text
 * @param {string[]} optimizedLines - array of lines from optimized text
 * @returns {Array<{type: 'unchanged'|'added'|'removed'|'modified', original: string|null, optimized: string|null}>}
 */
export function computeDiff(originalLines, optimizedLines) {
  if (!Array.isArray(originalLines) || !Array.isArray(optimizedLines)) {
    return [];
  }
  if (originalLines.length === 0 && optimizedLines.length === 0) {
    return [];
  }
  if (originalLines.length === 0) {
    return optimizedLines.map((line) => ({ type: 'added', original: null, optimized: line }));
  }
  if (optimizedLines.length === 0) {
    return originalLines.map((line) => ({ type: 'removed', original: line, optimized: null }));
  }

  const table = buildLCSTable(originalLines, optimizedLines);
  return backtrackDiff(originalLines, optimizedLines, table);
}
