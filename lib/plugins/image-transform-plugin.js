import path from 'path'
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img'

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default (eleventyConfig) => {
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ['webp', 'auto'],

    widths: ['auto'],

    svgShortCircuit: true,

    sharpOptions: {},
    sharpWebpOptions: {
      lossless: false,
      quality: 80,
    },
    sharpPngOptions: {
      quality: 100,
    },
    sharpJpegOptions: {
      quality: 80,
    },

    htmlOptions: {
      imgAttributes: {
        loading: 'lazy',
        decoding: 'async',
      },
    },

    filenameFormat: (id, src, width, format, options) => {
      const extension = path.extname(src)
      const name = path.basename(src, extension)
      return `${name}-${width}w.${format}`
    },
  })
}
