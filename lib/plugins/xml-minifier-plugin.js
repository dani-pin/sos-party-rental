import path from 'path'
import minifyXML from 'minify-xml'

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default (eleventyConfig) => {
  eleventyConfig.addTransform('xml-minifier', async function (content) {
    const ext = path.extname(this.page.outputPath)

    if (ext === '.xml') {
      return minifyXML(content)
    }

    return content
  })

  eleventyConfig.addTemplateFormats('xml')

  eleventyConfig.addExtension('xml', {
    outputFileExtension: 'xml',
    compile: (inputContent) => () => inputContent,
  })
}
