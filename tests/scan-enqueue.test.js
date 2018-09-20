/* eslint-env jest */

const scanEnqueue = require('../lib/scan-enqueue')

const scans = []
const bot = {
  sendMessage: (a, b, c) => {
    if (c && c.reply_to_message_id && c.reply_to_message_id === 1) {
      return {
        message_id: 99
      }
    } else {
      throw new Error('Error!!!')
    }
  }
}
test('scanEnqueue', () => {
  expect(scans.length).toBe(0)
  scanEnqueue(bot, 'user', 1, scans, 'report', 'file', true)
    .then(() => {
      expect(scans.length).toBe(1)
      expect(scans[0].user).toBe('user')
      expect(scans[0].report).toBe('report')
      expect(scans[0].type).toBe('file')
      expect(scans[0].msgId).toBe(99)
      expect(scans[0].isPrivate).toBe(true)
      expect(scans[0].ttl).toBe(255)
    })
    .catch((err) => {
      console.log(err)
    })
})
