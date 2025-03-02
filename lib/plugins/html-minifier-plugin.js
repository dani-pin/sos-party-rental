import path from 'path'
import htmlmin from 'html-minifier-terser'

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default (eleventyConfig) => {
  eleventyConfig.addTransform('html-minifier', async function (content) {
    const ext = path.extname(this.page.outputPath)

    if (ext === '.html') {
      return await htmlmin.minify(content, {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: true,
        html5: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        removeEmptyAttributes: false,
        removeEmptyElements: false,
        sortAttributes: true,
        sortClassName: true,
        useShortDoctype: true,
      })
    }

    return content
  })
}
