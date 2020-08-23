'use strict'

const fs = require('fs-extra')
const path = require('path')
const test = require('ava')
const globby = require('globby')
const lqip = require('.')

const fixtures = globby.sync('fixtures/*.{jpg,jpeg,webp,png}')
const outputDir = 'output'

test.before(async () => {
  await fs.ensureDir(outputDir)
})

for (const fixture of fixtures) {
  const name = fixture.split('/').pop().split('.').shift()

  test(`${fixture} => webp`, async (t) => {
    const result = await lqip(fixture)
    t.truthy(result)
    t.true(Buffer.isBuffer(result.content))
    t.true(result.metadata.width < result.metadata.originalWidth)
    t.true(result.metadata.height < result.metadata.originalHeight)

    await fs.writeFile(path.join(outputDir, `${name}.webp`), result.content)

    console.log(fixture, result.metadata)
    t.snapshot(result.metadata)
  })

  test(`${fixture} => jpeg`, async (t) => {
    const result = await lqip(fixture, { outputFormat: 'jpeg' })
    t.truthy(result)
    t.true(Buffer.isBuffer(result.content))
    t.true(result.metadata.width < result.metadata.originalWidth)
    t.true(result.metadata.height < result.metadata.originalHeight)

    await fs.writeFile(path.join(outputDir, `${name}.jpg`), result.content)

    console.log(fixture, result.metadata)
    t.snapshot(result.metadata)
  })
}

test('array of inputs', async (t) => {
  const results = await lqip(fixtures)
  t.true(Array.isArray(results))
  t.is(results.length, fixtures.length)

  for (const result of results) {
    t.true(Buffer.isBuffer(result.content))
    t.true(result.metadata.width < result.metadata.originalWidth)
    t.true(result.metadata.height < result.metadata.originalHeight)
  }
})
