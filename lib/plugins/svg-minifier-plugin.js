import path from 'path'
import { optimize } from 'svgo'

export default (eleventyConfig) => {
  eleventyConfig.addTransform('svg-minifier', async function (content) {
    const ext = path.extname(this.page.outputPath)

    if (ext === '.svg') {
      const result = optimize(content, {
        path: path.resolve(this.page.inputPath),
        multipass: true,
      })

      return result.data
    }

    return content
  })

  eleventyConfig.addTemplateFormats('svg')

  eleventyConfig.addExtension('svg', {
    outputFileExtension: 'svg',
    compile: (inputContent) => () => inputContent,
  })
}
