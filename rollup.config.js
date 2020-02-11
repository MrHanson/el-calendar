import resolve from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import vue from 'rollup-plugin-vue'
import buble from 'rollup-plugin-buble'
import { uglify } from 'rollup-plugin-uglify'
import visualizer from 'rollup-plugin-visualizer'
import autoprefixer from 'autoprefixer'

const version = process.env.VERSION || require('./package.json').version
const banner = '/**\n' + ' * @preserve\n' + ` * @mrhanson/el-calendar v${version}\n` + ' */'

const commonConfig = {
  input: 'src/Calendar.vue',
  external: ['vue'],
  plugins: [
    resolve(),
    commonjs(),
    vue({
      style: {
        postcssPlugins: [autoprefixer()]
      }
    }),
    buble()
  ]
}

if (process.env.REPORT !== undefined) {
  commonConfig.plugins.push(
    visualizer({
      filename: 'release/report.html',
      template: 'treemap'
    })
  )
}

export default [
  {
    ...commonConfig,
    output: {
      format: 'cjs',
      file: 'release/el-calendar.common.js',
      banner
    }
  },
  {
    ...commonConfig,
    output: {
      format: 'umd',
      globals: { vue: 'Vue' },
      file: 'release/el-calendar.umd.js',
      name: 'el-calendar',
      banner
    }
  },
  {
    ...commonConfig,
    output: {
      format: 'umd',
      globals: { vue: 'Vue' },
      file: 'release/el-calendar.umd.min.js',
      name: 'el-calendar',
      banner
    },
    plugins: [
      ...commonConfig.plugins,
      uglify({
        output: {
          // https://github.com/TrySound/rollup-plugin-uglify#comments
          comments: function(node, comment) {
            if (comment.type === 'comment2') {
              return /@preserve|@license|@cc_on/i.test(comment.value)
            }
            return false
          }
        }
      })
    ]
  }
]
