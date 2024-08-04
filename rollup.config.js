import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

export default [
  {
    input: ['./src/unity-companion.ts'],
    output: [
      {
        format: 'es',
        dir: './exports'
      }
    ],
    plugins: [nodeResolve({ browser: true }), typescript()]
  }
]
