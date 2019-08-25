'use strict';

const currify = require('currify/legacy');

const notContains = currify((array, a) => !array.includes(a));
const diff = (a, b) => a.filter(notContains(b));

module.exports = (pids, cleanPids) => {
    check(pids, cleanPids);
    
    return diff(pids, cleanPids);
};

function check(pids, cleanPids) {
    if (!Array.isArray(pids))
        throw Error('pids should be an array!');
    
    if (!Array.isArray(cleanPids))
        throw Error('cleanPids should be an array!');
}

