'use strict';

const test = require('tape');
const mock = require('mock-require');
const clear = require('clear-module');
const sinon = require('sinon');

const {
    getPids,
    pulloutPids,
} = require('..');

test('psedit: get', async (t) => {
    const psList = async () => {
        return [{
            pid: '1337',
            cmd: 'node',
            cpu: '0.1',
            name: 'node',
            memory: '6.0',
        }];
    };
    
    clear('..');
    mock('ps-list', psList);
    
    const {get} = require('..');
    const result = await get();
    const expected = [[
        '1337',
        '59.53mb',
        '0.1',
        '*node',
        'node',
    ]];
    
    mock.stop('ps-list');
    
    t.deepEqual(result, expected, 'should equal');
    t.end();
});

test('psedit: kill', (t) => {
    const {kill: originalKill} = process;
    const killStub = sinon.stub();
    
    process.kill = killStub;
    clear('..');
    const {kill} = require('..');
    
    kill([1337]);
    process.kill = originalKill;
    
    t.ok(killStub.calledWith(1337), 'should call kill');
    t.end();
});

test('psedit: build: table', async (t) => {
    const psList = async () => {
        return [{
            pid: '1337',
            cmd: 'node',
            cpu: '0.1',
            name: 'node',
            memory: '6.0',
        }];
    };
    
    clear('..');
    mock('ps-list', psList);
    
    const {get, build} = require('..');
    const data = await get();
    const result = build(data);
    const expected = '1337       59.53mb    0.1        *node node\n';
    
    mock.stop('ps-list');
    
    t.deepEqual(result, expected, 'should equal');
    t.end();
});

test('psedit: getPids', (t) => {
    const data = [[
        1
    ], [
        2
    ]];
    
    const result = getPids(data);
    const expected = [1, 2];
    
    t.deepEqual(result, expected, 'should equal');
    t.end();
});

test('psedit: getPids: no args', (t) => {
    t.throws(getPids, /apps should be an array!/, 'should throw');
    t.end();
});

test('psedit: pulloutPids', (t) => {
    t.throws(pulloutPids, /str should be a string!/, 'should throw');
    t.end();
});

test('psedit: pulloutPids', (t) => {
    const str = '1337       59.53mb    0.1        *node node\n';
    const result = pulloutPids(str);
    const expected = [1337];
    
    t.deepEqual(result, expected, 'should equal');
    t.end();
});

