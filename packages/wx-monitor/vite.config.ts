import { defineConfig, PluginOption } from 'vite';
import { resolve } from 'path';
import autoprefix from 'autoprefixer';
import nodePolyfills from 'rollup-plugin-node-polyfills';


export default defineConfig({
  plugins: [
    nodePolyfills()
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, './src')
      }
    ]
  },
  css: {
    postcss: {
      plugins: [
        autoprefix({
          overrideBrowserslist: ['last 20 versions']
        })
      ]
    }
  },

  build: {
    outDir: "dist/monitor",
    rollupOptions: {
      input: {
        monitor: resolve(__dirname, 'monitor.html')
      }
    },
    minify: false
  }
});

function scssLitPlugin(): PluginOption {
  var extReg = /.*scss$/;

  return {
    name: 'scss-lit',
    // enforce: 'post',
    transform(code: string, id) {
      if (extReg.test(id)) {
        // code = `import {css} from 'lit';\n css\`${code}\``;
        // code = `css\`${code}\``
        // console.log(id, code);
        return code;
      }
    }
  };
}
