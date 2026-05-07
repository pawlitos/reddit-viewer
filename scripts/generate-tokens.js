// scripts/generate-tokens.js
// ─────────────────────────────────────────────────────────────
// Run: node scripts/generate-tokens.js
// Or add to package.json: "generate": "node scripts/generate-tokens.js"
//
// Reads tokens.config.js → generates src/styles/_tokens.generated.scss
// ─────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

const config = require('../tokens.config.js');
const outputPath = path.resolve(__dirname, '../src/styles/_tokens.generated.scss');

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

// Converts camelCase keys and numbers to kebab-case
// e.g. fontSizes → font-sizes, '2xl' → '2xl' (unchanged)
const toKebab = (str) =>
  String(str)
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase();

// Generates a SCSS variable block from an object
// prefix: 'color', 'spacing' etc.
function buildVariables(obj, prefix) {
  return Object.entries(obj)
    .map(([key, val]) => `$${prefix}-${toKebab(key)}: ${val};`)
    .join('\n');
}

// Generates a SCSS map() from an object — useful for @each loops
function buildMap(obj, name) {
  const entries = Object.entries(obj)
    .map(([key, val]) => `  "${toKebab(key)}": ${val}`)
    .join(',\n');
  return `$${name}: (\n${entries}\n);`;
}

// Generates respond-to() mixins from a breakpoints map
function buildBreakpointMixins(breakpoints) {
  const lines = [];

  // Main mixin — from breakpoint upward (mobile-first)
  lines.push(`// Usage: @include respond-to('md') { ... }`);
  lines.push(`@mixin respond-to($bp) {`);
  lines.push(`  $value: map.get($breakpoints, $bp);`);
  lines.push(`  @if $value == null {`);
  lines.push(`    @error "Breakpoint '#{$bp}' does not exist in \\$breakpoints.";`);
  lines.push(`  }`);
  lines.push(`  @media screen and (min-width: $value) {`);
  lines.push(`    @content;`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push('');

  // bp-down mixin — up to and including the breakpoint
  lines.push(`// Usage: @include bp-down('md') { ... }`);
  lines.push(`@mixin bp-down($bp) {`);
  lines.push(`  $value: map.get($breakpoints, $bp);`);
  lines.push(`  @if $value == null {`);
  lines.push(`    @error "Breakpoint '#{$bp}' does not exist.";`);
  lines.push(`  }`);
  lines.push(`  @media screen and (max-width: calc($value - 0.02px)) {`);
  lines.push(`    @content;`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push('');

  // bp-between mixin — between two breakpoints
  lines.push(`// Usage: @include bp-between('sm', 'lg') { ... }`);
  lines.push(`@mixin bp-between($lower, $upper) {`);
  lines.push(`  $min: map.get($breakpoints, $lower);`);
  lines.push(`  $max: map.get($breakpoints, $upper);`);
  lines.push(`  @if $min == null { @error "Breakpoint '#{$lower}' does not exist."; }`);
  lines.push(`  @if $max == null { @error "Breakpoint '#{$upper}' does not exist."; }`);
  lines.push(`  @media screen and (min-width: $min) and (max-width: calc($max - 0.02px)) {`);
  lines.push(`    @content;`);
  lines.push(`  }`);
  lines.push(`}`);

  return lines.join('\n');
}

// Generates CSS custom properties (:root { --... })
function buildCSSVars(config) {
  const lines = [':root {'];

  const add = (prefix, obj) => {
    Object.entries(obj).forEach(([key, val]) => {
      lines.push(`  --${prefix}-${toKebab(key)}: ${val};`);
    });
  };

  add('color', config.colors);
  add('space', config.spacing);
  add('text', config.fontSizes);
  add('weight', config.fontWeights);
  add('radius', config.radii);
  add('shadow', config.shadows);
  add('transition', config.transitions);
  add('z', config.zIndex);

  lines.push('}');
  return lines.join('\n');
}

// ─────────────────────────────────────────────
// BUILDING THE SCSS FILE
// ─────────────────────────────────────────────

const {
  breakpoints,
  spacing,
  colors,
  fontSizes,
  fontWeights,
  lineHeights,
  radii,
  shadows,
  transitions,
  zIndex,
} = config;

const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

const output = `
// ════════════════════════════════════════════════════════════
// _tokens.generated.scss
// AUTO-GENERATED — do not edit manually!
// Source: tokens.config.js
// Generated: ${now}
//
// Usage in an Angular component:
//   @use 'src/styles/tokens.generated' as t;
//
//   .my-component {
//     color: t.$color-accent;
//     padding: t.$spacing-4;
//     @include t.respond-to('md') { ... }
//   }
// ════════════════════════════════════════════════════════════
@use "sass:map";


// ────────────────────────────────────────────
// BREAKPOINTS
// ────────────────────────────────────────────
// As a SCSS map — for use in mixins
${buildMap(
  Object.fromEntries(Object.entries(breakpoints).map(([k, v]) => [k, `${v}px`])),
  'breakpoints',
)}

// As separate variables — for direct use
${buildVariables(
  Object.fromEntries(Object.entries(breakpoints).map(([k, v]) => [k, `${v}px`])),
  'bp',
)}


// ────────────────────────────────────────────
// SPACING
// ────────────────────────────────────────────
${buildMap(spacing, 'spacing-map')}

${buildVariables(spacing, 'spacing')}


// ────────────────────────────────────────────
// COLORS
// ────────────────────────────────────────────
${buildMap(colors, 'colors-map')}

${buildVariables(colors, 'color')}


// ────────────────────────────────────────────
// TYPOGRAPHY
// ────────────────────────────────────────────
${buildVariables(fontSizes, 'font-size')}
${buildVariables(fontWeights, 'font-weight')}
${buildVariables(lineHeights, 'line-height')}


// ────────────────────────────────────────────
// BORDER RADIUS
// ────────────────────────────────────────────
${buildVariables(radii, 'radius')}


// ────────────────────────────────────────────
// SHADOWS
// ────────────────────────────────────────────
${buildVariables(shadows, 'shadow')}


// ────────────────────────────────────────────
// TRANSITIONS
// ────────────────────────────────────────────
${buildVariables(transitions, 'transition')}


// ────────────────────────────────────────────
// Z-INDEX
// ────────────────────────────────────────────
${buildVariables(zIndex, 'z')}


// ────────────────────────────────────────────
// BREAKPOINT MIXINS
// ────────────────────────────────────────────
${buildBreakpointMixins(breakpoints)}


// ────────────────────────────────────────────
// CSS CUSTOM PROPERTIES (:root)
// Importing this file once globally generates --color-accent etc.
// ────────────────────────────────────────────
${buildCSSVars(config)}
`.trimStart();

// ─────────────────────────────────────────────
// WRITE TO FILE
// ─────────────────────────────────────────────

const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(outputPath, output, 'utf8');

console.log(`✓ Generated: ${outputPath}`);
console.log(`  Breakpoints: ${Object.keys(breakpoints).join(', ')}`);
console.log(`  Colors:      ${Object.keys(colors).length} variables`);
console.log(`  Spacing:     ${Object.keys(spacing).length} variables`);
console.log(`  Total:       ~${output.split('\n').length} lines`);
