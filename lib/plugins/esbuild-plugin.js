import { promises as fs } from 'fs'
import path from 'path'
import * as esbuild from 'esbuild'

const enableSourceMaps = process.env.ELEVENTY_RUN_MODE === 'serve'

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default (eleventyConfig) => {
  eleventyConfig.addTemplateFormats('js')

  eleventyConfig.addExtension('js', {
    outputFileExtension: 'js',

    compile: async function (inputContent, inputPath) {
      if (path.basename(inputPath).startsWith('_')) {
        return
      }

      const result = await esbuild.build({
        stdin: {
          contents: inputContent,
          sourcefile: path.basename(inputPath),
          resolveDir: path.dirname(inputPath),
        },
        bundle: true,
        minify: true,
        sourcemap: enableSourceMaps,
        outfile: path.resolve(
          eleventyConfig.dir.output,
          path.relative(eleventyConfig.dir.input, inputPath),
        ),
        write: false,
        metafile: true,
        target: 'es6',
      })

      // tell eleventy to recompile this input file when its dependent files (e.g. sass imports) are modified
      const dependencies = Object.keys(result.metafile.inputs)
        .filter((file) => path.resolve(file) !== path.resolve(inputPath))
        .map((file) => path.resolve(file))

      this.addDependencies(inputPath, dependencies)

      if (result.errors.length > 0) {
        throw new Error(result.errors[0])
      }

      if (!result.outputFiles || result.outputFiles.length === 0) {
        throw new Error("esbuild didn't produce any output files")
      }

      if (enableSourceMaps && result.outputFiles.length < 2) {
        throw new Error("esbuild didn't produce a source map")
      }

      if (enableSourceMaps) {
        await fs.mkdir(path.dirname(result.outputFiles[0].path), {
          recursive: true,
        })

        await fs.writeFile(
          result.outputFiles[0].path,
          result.outputFiles[0].text,
        )
      }

      const output = enableSourceMaps
        ? result.outputFiles[1].text
        : result.outputFiles[0].text

      return () => output
    },
  })
}
