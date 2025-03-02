import { promises as fs } from 'fs'
import path from 'path'
import _ from 'lodash'
import CleanCSS from 'clean-css'

const enableSourceMaps = process.env.ELEVENTY_RUN_MODE === 'serve'

const sourceMapRegex = /\/\*# sourceMappingURL=(.+) \*\//

const hasSourceMap = (css) => {
  return sourceMapRegex.test(css)
}

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default (eleventyConfig) => {
  eleventyConfig.addTransform('css-minifier', async function (content) {
    const ext = path.extname(this.page.outputPath)

    if (ext === '.css') {
      if (content === undefined) {
        return
      }

      if (hasSourceMap(content)) {
        return content
      }

      const result = new CleanCSS({
        sourceMap: enableSourceMaps,
        sourceMapInlineSources: true,
      }).minify(content)

      if (result.errors.length > 0) {
        throw new Error(result.errors[0])
      }

      if (!enableSourceMaps) {
        return result.styles
      }

      if (!result.sourceMap) {
        throw new Error("clean-css didn't produce a source map")
      }

      result.sourceMap.setSourceContent(this.page.inputPath, content)

      const sourceMap = JSON.parse(result.sourceMap.toString())

      const sourceMapOutputPath = `${this.page.outputPath}.map`

      sourceMap.sources = [
        path
          .relative(
            path.dirname(sourceMapOutputPath),
            path.resolve(this.page.inputPath),
          )
          .replaceAll('\\', '/'),
      ]

      await fs.mkdir(path.dirname(sourceMapOutputPath), {
        recursive: true,
      })

      await fs.writeFile(sourceMapOutputPath, JSON.stringify(sourceMap))

      return (
        result.styles +
        `\n/*# sourceMappingURL=${path.basename(sourceMapOutputPath)} */`
      )
    }

    return content
  })

  eleventyConfig.addTemplateFormats('css')

  eleventyConfig.addExtension('css', {
    outputFileExtension: 'css',
    compile: (inputContent) => () => inputContent,
  })
}
