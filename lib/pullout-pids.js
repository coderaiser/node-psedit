'use strict';

const getPids = require('./get-pids');
const split = (a) => a.split(/\s+/);

module.exports = (str) => {
    check(str);
    
    const list = str
        .replace(/\n$/, '')
        .split('\n')
        .map(split);
    
    return getPids(list)
        .map(Number);
};

function check(str) {
    if (typeof str !== 'string')
        throw Error('str should be a string!');
}
