import config from '@quisido/eslint-config';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import ymlPlugin from 'eslint-plugin-yml';
import ymlPrettier from 'eslint-plugin-yml/lib/configs/prettier.js';
import ymlStandard from 'eslint-plugin-yml/lib/configs/standard.js';
import ymlParser from 'yaml-eslint-parser';

const YAML_INDENTS = 2;

export default [
  ...config,

  {
    files: ['**/*.yaml', '**/*.yml'],
    name: '@mtgenius/uncube/yml',

    languageOptions: {
      parser: ymlParser,
    },

    plugins: {
      yml: ymlPlugin,
    },

    rules: {
      ...ymlStandard.rules,
      doublequotes: 'off',
      'yml/block-mapping': ['error', 'always'],
      'yml/block-mapping-colon-indicator-newline': 'error',
      'yml/block-mapping-question-indicator-newline': 'error',
      'yml/block-sequence': 'error',
      'yml/block-sequence-hyphen-indicator-newline': 'error',
      'yml/flow-mapping-curly-newline': 'error',
      'yml/flow-sequence-bracket-newline': 'error',
      'yml/key-name-casing': 'off',
      'yml/no-empty-document': 'error',
      'yml/no-empty-key': 'error',
      'yml/no-empty-mapping-value': 'error',
      'yml/no-empty-sequence-entry': 'error',
      'yml/no-irregular-whitespace': 'error',
      'yml/no-tab-indent': 'error',
      'yml/plain-scalar': 'error',
      'yml/quotes': ['error', { avoidEscape: true, prefer: 'single' }],
      'yml/require-string-key': 'off',
      'yml/spaced-comment': 'error',
      'yml/vue-custom-block/no-parsing-error': 'error',

      'yml/file-extension': [
        'error',
        {
          caseSensitive: true,
          extension: 'yml',
        },
      ],

      'yml/flow-mapping-curly-spacing': [
        'error',
        'always',
        { arraysInObjects: false, objectsInObjects: true },
      ],

      'yml/flow-sequence-bracket-spacing': [
        'error',
        'never',
        {
          arraysInArrays: false,
          objectsInArrays: false,
          singleValue: false,
        },
      ],

      'yml/indent': [
        'error',
        YAML_INDENTS,
        { indentBlockSequences: true, indicatorValueIndent: 2 },
      ],

      'yml/key-spacing': [
        'error',
        { afterColon: true, beforeColon: false, mode: 'strict' },
      ],

      ...ymlPrettier.rules,

      'yml/sort-keys': [
        'error',
        { order: ['name', { order: { type: 'asc' } }], pathPattern: '^.+$' },
      ],
    },
  },

  {
    plugins: {
      '@typescript-eslint': tsPlugin,
    },

    rules: {
      'capitalized-comments': 'off',
      complexity: 'off',
      'max-depth': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      'no-alert': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
          // varsIgnorePattern: '^_',
        },
      ],
    },
  },
];
