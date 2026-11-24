import nextConfig from 'eslint-config-next';

const eslintConfig = [
  ...nextConfig,
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      '@next/next/no-img-element': 'warn',
    },
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'out/**',
      'build/**',
      '*.config.js',
      '*.config.mjs',
    ],
  },
];

export default eslintConfig;
