import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import istanbul from 'vite-plugin-istanbul'
import path from 'path'
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  return {
    plugins: !isProduction && [
      react(),
      [
        istanbul({
          include: 'src/*',
          exclude: ['node_modules', 'tests'],
          extension: ['.js', '.ts', '.tsx'],
          cypress: false,
          requireEnv: false,
        }),
      ],
      obfuscatorPlugin({
        include: ['dist/**/*.js'],
        exclude: [/node_modules/],
        apply: 'build',
        debugger: true,
        options: {
          debugProtection: true,
          stringArray: true,
          stringArrayEncoding: ['rc4'],
          stringArrayRotate: true,
          selfDefending: true,
        },
      }),
    ],
    base: isProduction ? '/admin/' : '/',
    server: {
      allowedHosts: ['test-company.insait.com', 'test-company.insait.io'],
      host: '0.0.0.0', // explicitly set to 0.0.0.0
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src/'),
        '@components': `${path.resolve(__dirname, './src/components/')}`,
        '@pages': path.resolve(__dirname, './src/pages'),
        '@image': path.resolve(__dirname, './src/assets/images'),
        '@locales': path.resolve(__dirname, './src/locales'),
        '@styles': path.resolve(__dirname, './src/styles'),
        '@hook': path.resolve(__dirname, './src/hook'),
      },
    },
    build: {
      sourcemap: !isProduction && true,
    },
  }
})
