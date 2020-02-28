"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const github = __importStar(require("@actions/github"));
const core = __importStar(require("@actions/core"));
const index_1 = __importDefault(require("../index"));
const nock_1 = __importDefault(require("nock"));
beforeEach(() => {
    jest.resetModules();
    process.env['GITHUB_TOKEN'] = '';
    github.context.payload = {
        repository: {
            owner: {
                login: 'testUser',
            },
            name: 'testingRepoName',
        },
        number: 1,
        commits: [],
    };
});
afterAll(() => {
    expect(nock_1.default.pendingMocks()).toEqual([]);
    nock_1.default.isDone();
    nock_1.default.cleanAll();
});
describe('debug action debug messages', () => {
    it('extract Jira Keys From Commit does not thow', async () => {
        jest.spyOn(core, 'getInput').mockImplementation((name) => {
            if (name === 'is-pull-request')
                return 'false';
            if (name === 'commit-message')
                return '';
            if (name === 'parse-all-commits')
                return 'false';
            return '';
        });
        await expect(index_1.default()).resolves.not.toThrow();
    });
    it('isPullRequest is true', async () => {
        const tokenNumber = jest.spyOn(core, 'getInput').mockImplementation((name) => {
            if (name === 'is-pull-request')
                return 'true';
            if (name === 'commit-message')
                return '';
            if (name === 'parse-all-commits')
                return 'false';
            return '';
        });
        await index_1.default();
        expect(tokenNumber.mock.results.length == 4);
        expect(tokenNumber.mock.results[0].value).toMatch('true');
        expect(tokenNumber.mock.results[1].value).toMatch('');
        expect(tokenNumber.mock.results[2].value).toMatch('false');
        // expect(tokenNumber.mock.results[3].value).toMatch('false');
    });
    it('false isPullRequest, true commit', async () => {
        jest.spyOn(core, 'getInput').mockImplementation((name) => {
            if (name === 'is-pull-request')
                return 'false';
            if (name === 'commit-message')
                return 'the commit message';
            if (name === 'parse-all-commits')
                return 'false';
            return '';
        });
        const coreOutput = jest.spyOn(core, 'setOutput').mockImplementationOnce((name) => {
            if (name === 'jira-keys')
                return 'true';
            return '';
        }).mockImplementation((name) => {
            if (name === 'jira-keys')
                return 'false';
            return '';
        });
        const consoleLog = jest.spyOn(console, 'log');
        await index_1.default();
        expect(consoleLog.mock.results.length).toBe(0);
        expect(coreOutput.mock.results.length).toBe(1);
        expect(coreOutput.mock.results[0].value).toMatch('true');
    });
    it('false isPullRequest, no commit-message input, true parseAllCommits', async () => {
        jest.spyOn(core, 'getInput').mockImplementation((name) => {
            if (name === 'is-pull-request')
                return 'false';
            if (name === 'commit-message')
                return '';
            if (name === 'parse-all-commits')
                return 'true';
            return '';
        });
        const coreOutput = jest.spyOn(core, 'setOutput').mockImplementationOnce((name) => {
            if (name === 'jira-keys')
                return 'blue';
            return '';
        }).mockImplementationOnce((name) => {
            if (name === 'jira-keys')
                return 'red';
            return '';
        }).mockImplementation((name) => {
            if (name === 'jira-keys')
                return 'green';
            return '';
        });
        const consoleLog = jest.spyOn(console, 'log');
        await (index_1.default());
        expect(consoleLog.mock.results.length).toBe(0);
        expect(coreOutput.mock.results.length).toBe(1);
        expect(coreOutput.mock.results[0].value).toMatch('blue');
    });
});
