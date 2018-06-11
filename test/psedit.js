'use strict';

const test = require('tape');
const mock = require('mock-require');
const sinon = require('sinon');
const {reRequire} = mock;

const {
    getPids,
    pulloutPids,
    diff,
    build,
} = require('..');

test('psedit: get', async (t) => {
    const processes = async () => {
        return {
            list: [{
                pid: '1337',
                mem_vsz: 38432,
                pcpu: 0.3954900885279194,
                name: 'init',
                command: '/sbin/init',
            }]
        };
    };
    
    mock('systeminformation', {processes});
   
    const {get} = reRequire('..');
    const result = await get();
    const expected = [[
        '1337',
        '37.53kb',
        '0.4',
        '*init',
        '/sbin/init',
    ]];
    
    mock.stop('systeminformation');
    
    t.deepEqual(result, expected, 'should equal');
    t.end();
});

test('psedit: get: low cpu load', async (t) => {
    const processes = async () => {
        return {
            list: [{
                pid: '1337',
                mem_vsz: 38432,
                pcpu: 0.0004900885279194,
                name: 'init',
                command: '/sbin/init',
            }]
        };
    };
    
    mock('systeminformation', {processes});
   
    const {get} = reRequire('..');
    const result = await get();
    const expected = [[
        '1337',
        '37.53kb',
        '0.0',
        '*init',
        '/sbin/init',
    ]];
    
    mock.stop('systeminformation');
    
    t.deepEqual(result, expected, 'should equal');
    t.end();
});

test('psedit: get', async (t) => {
    const {get} = require('..');
    const result = await get();
    
    t.ok(Array.isArray(result),  'should return array');
    t.end();
});

test('psedit: kill', (t) => {
    const {kill: originalKill} = process;
    const killStub = sinon.stub();
    
    process.kill = killStub;
    const {kill} = reRequire('..');
    
    kill([1337]);
    process.kill = originalKill;
    
    t.ok(killStub.calledWith(1337, 'SIGKILL'), 'should call kill');
    t.end();
});

test('psedit: build: table', async (t) => {
    const data = [[
        '1337',
        '59.53mb',
        '0.1',
        '*node',
        'node',
    ]];
    
    const result = build(data);
    const expected = '1337       59.53mb    0.1        *node node\n';
    
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

test('psedit: pulloutPids: no args', (t) => {
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

test('psedit: pulloutPids', (t) => {
    const str = '1337       59.53mb    0.1        *node node\n';
    const result = pulloutPids(str);
    const expected = [1337];
    
    t.deepEqual(result, expected, 'should equal');
    t.end();
});

test('psedit: diff: no args', (t) => {
    t.throws(diff, /pids should be an array!/, 'should throw');
    t.end();
});

test('psedit: diff: no cleanPids', (t) => {
    const fn = () => diff([]);
    
    t.throws(fn, /cleanPids should be an array!/, 'should throw');
    t.end();
});

test('psedit: diff: no cleanPids', (t) => {
    const result = diff([1, 2, 3], [1, 3]);
    const expected = [
        2
    ];
    
    t.deepEqual(result, expected, 'should equal');
    t.end();
});
