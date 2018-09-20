/* eslint-env jest */
const processScanQueue = require('../lib/process-scan-queue')
jest.mock('./../lib/send-report')

const scans = []

describe('Process scan queue', () => {
  test('TTL', () => {
    scans.push({
      ttl: 0,
      type: 'file',
      report: '',
      user: 'user',
      msgId: 1,
      isPrivate: true
    })
    expect(scans.length).toBe(1)
    processScanQueue(null, null, scans)
      .then(() => expect(scans.length).toBe(0))
  })

  test('successful file scan', () => {
    scans.push({
      ttl: 255,
      type: 'file',
      report: '',
      user: 'user',
      msgId: 1,
      isPrivate: true
    })
    const virusTotal = {
      fileReport: async (resource) => {
        return {
          response_code: 1
        }
      }
    }
    expect(scans.length).toBe(1)
    processScanQueue(null, virusTotal, scans)
      .then(() => expect(scans.length).toBe(0))
  })

  test('queued file scan', () => {
    scans.push({
      ttl: 255,
      type: 'file',
      report: '',
      user: 'user',
      msgId: 1,
      isPrivate: true
    })
    const virusTotal = {
      fileReport: async (resource) => {
        return {
          response_code: 2
        }
      }
    }
    expect(scans.length).toBe(1)
    processScanQueue(null, virusTotal, scans)
      .then(() => {
        expect(scans.length).toBe(9)
      })
      .catch((err) => console.log(err))
  })
})
