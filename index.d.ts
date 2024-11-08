import type { JpegOptions, WebpOptions } from 'sharp'

export type LqipModernFormat = 'webp' | 'jpeg'

export type LqipModernOutput = {
  /** Raw content of the resized output image. */
  content: Buffer
  metadata: {
    /** Width of the original image. */
    originalWidth: number

    /** height of the original image. */
    originalHeight: number

    /** Width of the output image. */
    width: number

    /** Height of the output image. */
    height: number

    /** Type of the output image. **/
    type: LqipModernFormat

    /** Output image as a data URI. */
    dataURIBase64: string
  }
}

export type LqipModernOptions = {
  /**
   * Output format to use; either `webp` or `jpeg` (passing `jpg` is the same as passing `jpeg`).
   */
  outputFormat?: 'webp' | 'jpeg' | 'jpg'

  /**
   * Output options passed to either `sharp.webp` or `sharp.jpeg` dependent on `opts.outputFormat`.
   */
  outputOptions?: WebpOptions | JpegOptions

  /**
   * Options to pass to `sharp.resize`. Defaults to resizing inputs to a max dimension of `16`, with the other dimension being calculated to maintain aspect ratio. If you want more control, you can pass an array of args here which will be forwarded to `sharp.resize`.
   */
  resize?: number | number[]

  /** Concurrency when processing an array of input images. */
  concurrency?: number
}

export default function lqipModern(
  input: string | string[] | Buffer | Buffer[] | ArrayBuffer | ArrayBuffer[],
  opts?: LqipModernOptions
): Promise<LqipModernOutput>
