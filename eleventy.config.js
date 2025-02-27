import 'dotenv/config'
import path from 'path'
import { EleventyHtmlBasePlugin } from '@11ty/eleventy'
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img'

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./public/fonts/')
  eleventyConfig.addPassthroughCopy('./public/images/')
  eleventyConfig.addPassthroughCopy('./public/**/*.{css,js}')

  eleventyConfig.addPlugin(EleventyHtmlBasePlugin)
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ['avif', 'webp', 'auto'],

    widths: [200, 400, 850, 1920, 2500],

    htmlOptions: {
      imgAttributes: {
        loading: 'lazy',
        decoding: 'async',
      },
      pictureAttributes: {},
    },

    filenameFormat: (id, src, width, format, options) => {
      const extension = path.extname(src)
      const name = path.basename(src, extension)
      return `${name}-${width}w.${format}`
    },
  })

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

  eleventyConfig.addCollection('sitemap', (collections) => {
    return collections.getAll().filter((item) => {
      return item.page.outputFileExtension === 'html'
    })
  })
}

/** @param {import("@11ty/eleventy").UserConfig} config */
export const config = {
  pathPrefix: process.env.PATH_PREFIX,
  dir: {
    input: 'public',
  },
}
