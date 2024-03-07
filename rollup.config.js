import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import externalGlobals from 'rollup-plugin-external-globals';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import nodePolyfill from 'rollup-plugin-polyfill-node';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import tsTrans from 'rollup-plugin-typescript2';
import { visualizer } from 'rollup-plugin-visualizer';
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
        'react-dom/client': 'ReactDOM',
      },
    },
  ],
  external: ['react'],
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    peerDepsExternal(),
    nodePolyfill(),
    postcss({
      extract: true,
      plugins: [
        tailwindcss('./tailwind.config.js'),
        require('autoprefixer'),
        require('cssnano')({ preset: 'default' }),
      ],
    }),
    nodeResolve(),
    commonjs(),
    tsTrans({
      useTsconfigDeclarationDir: true,
      exclude: ['**/__tests__/**', '**/*.stories.tsx', 'node_modules/**/*'],
      clean: true,
      typescript: ts,
    }),
    externalGlobals({
      react: 'React',
      'react-dom': 'ReactDOM',
    }),
    terser(),
    visualizer({
      emitFile: true,
      filename: 'stats.html',
    }),
  ],
};
