import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import tsTrans from 'rollup-plugin-typescript2';
import ts from 'typescript';

const tailwindcss = require('tailwindcss');

export default {
  context: 'this',
  input: 'src/index.ts',
  output: [
    {
      file: 'build/index.js',
      format: 'cjs',
      sourcemap: false,
      exports: 'named',
    },
    {
      exports: 'named',
      file: 'build/index.min.js',
      format: 'iife',
      sourcemap: false,
      name: '$MMedia',
      globals: {
        react: 'React',
        'react-dom/client': 'ReactDOM',
        path: 'path',
        fs: 'fs',
        http: 'http',
        https: 'https',
        crypto: 'crypto',
        stream: 'stream',
        constants: 'constants',
      },
    },
  ],
  external: [
    'react',
    'path',
    'fs',
    'http',
    'https',
    'crypto',
    'stream',
    'constants',
  ],
  plugins: [
    peerDepsExternal(),
    postcss({
      extract: true,
      plugins: [
        tailwindcss('./tailwind.config.js'),
        require('autoprefixer'),
        require('cssnano')({ preset: 'default' }),
      ],
    }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    nodeResolve({ preferBuiltins: false, browser: true }),
    commonjs(),
    tsTrans({
      useTsconfigDeclarationDir: true,
      exclude: ['node_modules/**/*', '**/__tests__/**', '**/*.stories.tsx'],
      clean: true,
      typescript: ts,
    }),
    terser(),
  ],
};
