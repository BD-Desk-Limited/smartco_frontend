// ESLint flat config for Next.js 13+ (ESLint v9+)
import coreWebVitals from 'eslint-config-next/core-web-vitals';

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [{ ignores: ['.next/**', 'Documents/**'] }, ...coreWebVitals];

export default config;
