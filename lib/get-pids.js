'use strict';

const getFirst = (a) => a[0];
const getPids = (a) => a.map(getFirst);

module.exports = (apps) => {
    check(apps);
    
    return getPids(apps);
};

function check(apps) {
    if (!apps || !Array.isArray(apps))
        throw Error('apps should be an array!');
}
