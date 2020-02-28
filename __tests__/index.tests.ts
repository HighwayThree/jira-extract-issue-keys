import * as github from '@actions/github'
import * as core from '@actions/core'
import extractJiraKeysFromCommit from '../index'
import {WebhookPayload} from '@actions/github/lib/interfaces'
import nock from 'nock'

beforeEach( () => {
    jest.resetModules();
    process.env['GITHUB_TOKEN'] = '';
    github.context.payload = {
      repository:{
        owner: {
          login: 'testUser',
        },
        name: 'testingRepoName',
      },
      number: 1,
      commits: [],
    } as WebhookPayload
})

afterAll( () => {
  expect(nock.pendingMocks()).toEqual([])
  nock.isDone()
  nock.cleanAll()
})

describe('debug action debug messages', () => {
  it('extract Jira Keys From Commit does not thow', async () => {
    jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
      if (name === 'is-pull-request') return 'false'
      if (name === 'commit-message') return ''
      if (name === 'parse-all-commits') return 'false'
      return ''
    });
    await expect(extractJiraKeysFromCommit()).resolves.not.toThrow();
  })
  it('isPullRequest is true', async () => {
    const tokenNumber = jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
      if (name === 'is-pull-request') return 'true'
      if (name === 'commit-message') return ''
      if (name === 'parse-all-commits') return 'false'
      return ''
    });

    await extractJiraKeysFromCommit();

    expect(tokenNumber.mock.results.length == 4);
    expect(tokenNumber.mock.results[0].value).toMatch('true');
    expect(tokenNumber.mock.results[1].value).toMatch('');
    expect(tokenNumber.mock.results[2].value).toMatch('false');
    // expect(tokenNumber.mock.results[3].value).toMatch('false');
  })
  it('false isPullRequest, true commit', async () =>{
    jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
      if (name === 'is-pull-request') return 'false'
      if (name === 'commit-message') return 'the commit message'
      if (name === 'parse-all-commits') return 'false'
      return ''
    });
    const coreOutput = jest.spyOn(core, 'setOutput').mockImplementationOnce((name: string): string => {
      if(name === 'jira-keys') return 'true';
      return '';
    }).mockImplementation((name: string) => {
      if(name === 'jira-keys') return 'false';
      return '';
    });
    const consoleLog = jest.spyOn(console, 'log');

    await extractJiraKeysFromCommit();
    expect(consoleLog.mock.results.length).toBe(0);
    expect(coreOutput.mock.results.length).toBe(1);
    expect(coreOutput.mock.results[0].value).toMatch('true')
  })
  it('false isPullRequest, no commit-message input, true parseAllCommits', async () =>{
    jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
      if (name === 'is-pull-request') return 'false'
      if (name === 'commit-message') return ''
      if (name === 'parse-all-commits') return 'true'
      return ''
    });
    const coreOutput = jest.spyOn(core, 'setOutput').mockImplementationOnce((name: string): string => {
      if(name === 'jira-keys') return 'blue';
      return '';
    }).mockImplementationOnce((name: string) => {
      if(name === 'jira-keys') return 'red';
      return '';
    }).mockImplementation((name: string) => {
      if(name === 'jira-keys') return 'green';
      return '';
    });
     const consoleLog = jest.spyOn(console, 'log');

    await (extractJiraKeysFromCommit());
    expect(consoleLog.mock.results.length).toBe(0);
    expect(coreOutput.mock.results.length).toBe(1);
    expect(coreOutput.mock.results[0].value).toMatch('blue');
  })
})
