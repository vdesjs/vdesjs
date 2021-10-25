import typescript from '@rollup/plugin-typescript';

module.exports = {
  input: 'src/compile/index.ts',
  output: [
    {
      file: 'dist/compile/index.js',
      format: 'cjs'
    },
    {
      file: 'dist/compile/index.es.js',
      format: 'es'
    }
  ],
  plugins: [typescript({ tsconfig: './tsconfig.json', include: ['src/compile/**/*'] })]
};
