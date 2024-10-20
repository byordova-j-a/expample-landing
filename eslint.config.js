import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
// import stylisticJs from "@stylistic/eslint-plugin-js";
import eslintConfigPrettier from '@vue/eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist'],
  },
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  eslintConfigPrettier,
  importPlugin.flatConfigs.recommended,
  {
    rules: {
      // 'vue/no-unused-refs': 'error',
      'import/newline-after-import': 'error',
    },
  },
  {
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
  },
];
