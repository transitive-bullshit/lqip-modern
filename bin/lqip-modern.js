#!/usr/bin/env node

const [, , file, ending = 'webp', size = '16', blur = 'false'] = process.argv
const lqip = require('../index')
const fs = require('node:fs')

lqip(file, {
  outputFormat: ending,
  resize: +size,
  blur: blur === 'true' || blur === 'false' ? Boolean(blur) : +blur
}).then((result) => {
  console.log(result.metadata.dataURIBase64)
  fs.writeFileSync(file.split('.')[0] + '.' + ending, result.content)
})
