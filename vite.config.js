import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

function copyStaticDir(dirName) {
  const source = path.resolve(dirName)
  return {
    name: 'copy-' + dirName,
    closeBundle() {
      fs.cpSync(source, path.resolve('dist', dirName), { recursive: true })
    },
  }
}

function htmlIncludes() {
  const dir = path.resolve('partials')
  const tokens = {
    '<!-- include:headers -->': 'headers.html',
    '<!-- include:footer -->': 'footer.html',
    '<!-- include:floatbar -->': 'floatbar.html',
  }
  return {
    name: 'html-includes',
    transformIndexHtml(html) {
      let out = html
      for (const [token, file] of Object.entries(tokens)) {
        const fragment = fs.readFileSync(path.join(dir, file), 'utf8')
        out = out.split(token).join(fragment)
      }
      return out
    },
  }
}

export default defineConfig({
  root: '.',
  publicDir: false,
  plugins: [htmlIncludes(), copyStaticDir('js'), copyStaticDir('images')],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve('./index.html'),
        products: path.resolve('./products.html'),
        solutions: path.resolve('./solutions.html'),
        service: path.resolve('./service.html'),
        company: path.resolve('./company.html'),
        contact: path.resolve('./contact.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
