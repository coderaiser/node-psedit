'use strict';

const os = require('os');

const ps = require('ps-list');
const t = require('table');
const format = require('format-io');

const pulloutPids = require('./pullout-pids');
const getPids = require('./get-pids');

const TOTAL = os.totalmem();
const PID = process.pid;

const table = t.table;
const getBorderCharacters = t.getBorderCharacters;

const formatSize = (a) => format.size(TOTAL / 100 * a);
const parse = (list) => list.map(getFields);
const isMemory = (a) => a.memory !== '0.0';
const isNotPS = (a) => a.cmd !== 'ps awwxo pid,args';
const isNotOwnPid = (a) => a.pid !== PID;

const filter = (a) => {
    return a
        .filter(isMemory)
        .filter(isNotPS)
        .filter(isNotOwnPid);
};

module.exports.get = () => {
    return ps()
        .then(filter)
        .then(parse);
};

module.exports.build = build;
module.exports.kill = (pids) => pids.map(kill);
module.exports.pulloutPids = pulloutPids;
module.exports.getPids = getPids;

// no bind
// https://github.com/nodejs/node/blob/master/lib/process.js
function kill(pid) {
    process.kill(pid);
}

function getFields(app) {
    const pid = app.pid;
    const memory = app.memory;
    const cpu = app.cpu;
    const name = app.name;
    const cmd = app.cmd;
    
    return [
        pid,
        formatSize(memory),
        cpu,
        `*${name}`,
        cmd,
    ];
}

const trim = (a) => a.trim();
const trimEnds = (str) => {
    return str
        .split('\n')
        .map(trim)
        .join('\n');
}

function build(data) {
    return trimEnds(table(data, {
        border: getBorderCharacters('void'),
        columnDefault: {
            paddingLeft: 0,
            paddingRight: 1,
        },
        drawHorizontalLine: () => false,
        columns: [{
            width: 10,
        }, {
            width: 10
        }, {
            width: 10
        }],
    }));
}

