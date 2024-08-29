import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import configPrettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier/recommended';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
  { languageOptions: { globals: globals.browser } },
  { languageOptions: { globals: { uni: true, wx: true } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  pluginPrettier,
  configPrettier,
  { files: ['**/*.vue'], languageOptions: { parserOptions: { parser: tseslint.parser } } },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    ignores: [
      '.prettierrc.js',
      'postcss.config.js',
      'tailwind.config.js',
      'shims-uni.d.ts',
      '**/shime-uni.d.ts',
      'eslint.config.mjs'
    ]
  }
];
