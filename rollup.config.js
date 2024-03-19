import ts from 'typescript'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import tsTrans from 'rollup-plugin-typescript2'
import imageResolve from '@rollup/plugin-image'
import alias from '@rollup/plugin-alias'
import path from 'path'

const tailwindcss = require('tailwindcss')

export default {
  context: 'this',
  input: 'src/index.ts',
  onwarn(warning, warn) {
    if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
      return
    }
    warn(warning)
  },
  output: {
    exports: 'named',
    file: 'build/index.min.js',
    format: 'iife',
    sourcemap: false,
    name: '$MMedia',
    preserveModules: false,
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
  external: ['react', 'path', 'fs', 'http', 'https', 'crypto', 'stream', 'constants', '@/src/assets'],
  plugins: [
    peerDepsExternal(),
    alias({
      entries: [{ find: '@', replacement: path.resolve(__dirname) }],
    }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    nodeResolve({
      preferBuiltins: false,
      browser: true,
    }),
    imageResolve(),
    commonjs(),
    tsTrans({
      useTsconfigDeclarationDir: true,
      exclude: ['node_modules/tus-js-client/**/*', '**/__tests__/**', '**/*.stories.tsx'],
      clean: true,
      typescript: ts,
    }),
    terser(),
    postcss({
      extract: true,
      plugins: [
        tailwindcss('./tailwind.config.js'),
        require('autoprefixer'),
        require('cssnano')({ preset: 'default' }),
      ],
      minimize: true,
      extensions: ['.scss', '.sass', '.css'],
    }),
  ],
}
