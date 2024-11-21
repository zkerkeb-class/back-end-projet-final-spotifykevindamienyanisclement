module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'init',
        'feat',
        'fix',
        'perf',
        'refactor',
				'release',
        'style',
        'test',
				'revert',
				'wip',
      ],
    ],
    'scope-case': [2, 'always', 'lower-case'],
  },
};
