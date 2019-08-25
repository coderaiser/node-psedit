'use strict';

const os = require('os');

const ps = require('systeminformation').processes;
const format = require('format-io');

const pulloutPids = require('./pullout-pids');
const getPids = require('./get-pids');
const diff = require('./diff');

const PID = process.pid;

const {
    table,
    getBorderCharacters,
} = require('table');

const cpuCount = os.cpus().length;

const getList = (a) => a.list;
const formatCPU = (a) => {
    const result = Math.round(a / cpuCount * 10) / 10;
    
    if (!result)
        return '0.0';
    
    return String(result);
};
const parse = (list) => list.map(getFields);
const isMemory = (a) => a.mem_vsz;
const isNotOwnPid = (a) => a.pid !== PID;

const getCmd = (path, params) => !params ? path : `${path} ${params}`;

const filter = (a) => {
    return a
        .filter(isMemory)
        .filter(isNotOwnPid);
};

module.exports.get = () => {
    return ps()
        .then(getList)
        .then(filter)
        .then(parse);
};

module.exports.build = build;
module.exports.kill = (pids) => pids.map(kill);
module.exports.pulloutPids = pulloutPids;
module.exports.getPids = getPids;
module.exports.diff = diff;

// no bind
// https://github.com/nodejs/node/blob/master/lib/process.js
function kill(pid) {
    process.kill(pid, 'SIGKILL');
}

function getFields(app) {
    const {
        pid,
        name,
    } = app;
    const memory = app.mem_vsz;
    const cpu = app.pcpu;
    const cmd = getCmd(app.path, app.params);
    
    return [
        pid,
        format.size(memory),
        formatCPU(cpu),
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
};

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
            width: 10,
        }, {
            width: 10,
        }],
    }));
}

