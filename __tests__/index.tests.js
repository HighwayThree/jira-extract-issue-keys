"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as core from '@actions/core'
const index_1 = __importDefault(require("../index"));
beforeEach(() => {
    jest.resetModules();
});
describe('debug action debug messages', () => {
    it('extract Jira Keys From Commit', async () => {
        await expect(index_1.default()).resolves.not.toThrow();
    });
});
