import sharp from 'sharp'
import pMap from 'p-map'

export default function lqipModern(input, opts = {}) {
  const { concurrency = 4, ...rest } = opts

  if (Array.isArray(input)) {
    return pMap(input, async (image) => computeLqipImage(image, rest), {
      concurrency
    })
  } else {
    return computeLqipImage(input, opts)
  }
}

async function computeLqipImage(input, opts = {}) {
  const { resize = 16, outputFormat = 'webp', outputOptions } = opts

  const image = sharp(input).rotate()
  const metadata = await image.metadata()

  const resized = image.resize(
    ...(Array.isArray(resize)
      ? resize
      : [
          Math.min(metadata.width, resize),
          Math.min(metadata.height, resize),
          { fit: 'inside' }
        ])
  )
  let output

  if (outputFormat === 'webp') {
    output = resized.webp({
      quality: 20,
      alphaQuality: 20,
      smartSubsample: true,
      ...outputOptions
    })
  } else if (outputFormat === 'jpg' || outputFormat === 'jpeg') {
    output = resized.jpeg({
      quality: 20,
      ...outputOptions
    })
  } else {
    throw new Error(`Invalid outputformat "${outputFormat}"`)
  }

  const { data, info } = await output.toBuffer({ resolveWithObject: true })

  return {
    content: data,
    metadata: {
      originalWidth: metadata.width,
      originalHeight: metadata.height,
      width: info.width,
      height: info.height,
      type: outputFormat,
      dataURIBase64: `data:image/webp;base64,${data.toString('base64')}`
    }
  }
}
