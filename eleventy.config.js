import 'dotenv/config'
import { EleventyHtmlBasePlugin } from '@11ty/eleventy'
import esbuildPlugin from './lib/plugins/esbuild-plugin.js'
import imageTransformPlugin from './lib/plugins/image-transform-plugin.js'
import sitemapPlugin from './lib/plugins/sitemap-plugin.js'
import htmlMinifierPlugin from './lib/plugins/html-minifier-plugin.js'
import xmlMinifierPlugin from './lib/plugins/xml-minifier-plugin.js'
import cssMinifierPlugin from './lib/plugins/css-minifier-plugin.js'
import svgMinifierPlugin from './lib/plugins/svg-minifier-plugin.js'

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function (eleventyConfig) {
  eleventyConfig.setQuietMode(true)

  // PASSTHROUGH COPIES
  eleventyConfig.addPassthroughCopy('public/images/')
  eleventyConfig.addPassthroughCopy('public/fonts/')

  // FILTERS/SHORTCODES
  eleventyConfig.addFilter('i18n', function (key, lang) {
    lang ??= this.ctx.lang

    if (this.ctx.i18n.hasOwnProperty(lang)) {
      const translations = this.ctx.i18n[lang]

      if (translations.hasOwnProperty(key)) {
        return translations[key]
      }
    }

    return key
  })

  // PLUGINS
  eleventyConfig.addPlugin(sitemapPlugin)

  // TRANSFORM/COMPILATION PLUGINS
  // resolve absolute paths using configured path prefix
  // (e.g. img src attributes and css link attributes)
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin)
  eleventyConfig.addPlugin(imageTransformPlugin)
  eleventyConfig.addPlugin(htmlMinifierPlugin)
  eleventyConfig.addPlugin(xmlMinifierPlugin)
  eleventyConfig.addPlugin(svgMinifierPlugin)
  eleventyConfig.addPlugin(cssMinifierPlugin)
  eleventyConfig.addPlugin(esbuildPlugin)
}

/** @param {import("@11ty/eleventy").UserConfig} config */
export const config = {
  pathPrefix: process.env.PATH_PREFIX,
  dir: {
    input: 'public',
  },
}
