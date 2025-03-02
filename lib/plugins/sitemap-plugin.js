/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default (eleventyConfig) => {
  eleventyConfig.addCollection('sitemap', (collections) => {
    return collections.getAll().filter((item) => {
      return item.page.outputFileExtension === 'html'
    })
  })
}
