/* eslint-env jest */

const math = require('./math')

test('sample', () => {
  expect(math.add(2, 3)).toBe(5)
  expect(math.multiply(2, 3)).toBe(6)
})
