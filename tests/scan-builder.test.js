/* eslint-env jest */

const scanBuilder = require('../lib/scan-builder')

test('scanBuilder document', () => {
  const msg = {
    document: {
      file_size: (32 * 1024 * 1024) + 1,
      file_id: 1,
      file_name: 'rem'
    },
    chat: {
      type: 'channel'
    }
  }
  scanBuilder(msg, null)
    .then((scan) => {
      expect(scan).toBe(null)
    })
})

test('scanBuilder URL', () => {
  const msg = {
    text: 'https://google.com',
    chat: {
      type: 'private'
    }
  }
  scanBuilder(msg, null)
    .then((scan) => {
      expect(scan).toHaveProperty('url')
      expect(scan.url).toBe('https://google.com')
    })
})

test('scanBuilder domain', () => {
  const msg = {
    text: 'google.com',
    chat: {
      type: 'private'
    }
  }
  scanBuilder(msg, null)
    .then((scan) => {
      expect(scan).toHaveProperty('domain')
      expect(scan.domain).toBe('google.com')
    })
})

test('scanBuilder ip', () => {
  const msg = {
    text: '8.8.8.8',
    chat: {
      type: 'private'
    }
  }
  scanBuilder(msg, null)
    .then((scan) => {
      expect(scan).toHaveProperty('ip')
      expect(scan.ip).toBe('8.8.8.8')
    })
})

test('scanBuilder unknown', () => {
  const msg = {
    text: 'remisa',
    chat: {
      type: 'private'
    }
  }
  scanBuilder(msg, null)
    .then((scan) => {
      expect(scan.unknown).toBe(true)
    })
})

test('scanBuilder none text', () => {
  const msg = {
    chat: {
      type: 'private'
    }
  }
  scanBuilder(msg, null)
    .then((scan) => {
      expect(scan.unknown).toBe(true)
    })
})
