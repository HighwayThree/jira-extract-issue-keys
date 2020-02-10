// import * as core from '@actions/core'
import extractJiraKeysFromCommit from '../index'

beforeEach( () => {
    jest.resetModules();
})

describe('debug action debug messages', () => {
  it('extract Jira Keys From Commit', async () => {
    await expect(extractJiraKeysFromCommit()).resolves.not.toThrow()
  })
})