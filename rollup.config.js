import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import externalGlobals from 'rollup-plugin-external-globals';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import { visualizer } from 'rollup-plugin-visualizer';

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
    peerDepsExternal(),
    resolve({ jsnext: true, main: true }),
    visualizer({
      emitFile: true,
      filename: 'stats.html',
    }),
    postcss({
      extract: true,
      plugins: [
        tailwindcss('./tailwind.config.js'),
        require('autoprefixer'),
        require('cssnano')({ preset: 'default' }),
      ],
    }),
    typescript({
      useTsconfigDeclarationDir: true,
      exclude: ['**/__tests__/**', '**/*.stories.tsx'],
      clean: true,
    }),
    externalGlobals({
      react: 'React',
      'react-dom': 'ReactDOM',
    }),
    commonjs({
      include: ['node_modules/**'],
    }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    terser(),
  ],
};
