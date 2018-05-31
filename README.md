# psedit [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

Edit processes list

## Install

`npm i psedit`

## API

### get

Get list of processes.

```js
const {get} = require('psedit');

get()
    .then(console.log)
    .catch(console.error);

// returns
[[
    1337,
    '59.53mb',
    '0.1',
    '*node',
    'node',
]];

```

### build

Build processes table.

```js
const {get, build} = require('psedit');

get()
    .then(build)
    .catch(console.error);

// returns
'1337       59.53mb    0.1        *node node\n';
```

### pulloutPids

Get pids from built table

```js
const {
    get,
    build,
    pulloutPids,
} = require('psedit');

get()
    .then(build)
    .then(pulloutPids)
    .catch(console.error);

// returns
[1337]

```

### kill

Kill processes

```js
const {kill} = require('psedit');

kill([1, 2, 3]);
```

## License

MIT

[NPMIMGURL]:                https://img.shields.io/npm/v/psedit.svg?style=flat
[BuildStatusIMGURL]:        https://img.shields.io/travis/coderaiser/node-psedit/master.svg?style=flat
[DependencyStatusIMGURL]:   https://img.shields.io/david/coderaiser/node-psedit.svg?style=flat
[LicenseIMGURL]:            https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]:                   https://npmjs.org/package/psedit "npm"
[BuildStatusURL]:           https://travis-ci.org/coderaiser/node-psedit  "Build Status"
[DependencyStatusURL]:      https://david-dm.org/coderaiser/node-psedit "Dependency Status"
[LicenseURL]:               https://tldrlegal.com/license/mit-license "MIT License"

[CoverageURL]:              https://coveralls.io/github/coderaiser/node-psedit?branch=master
[CoverageIMGURL]:           https://coveralls.io/repos/coderaiser/node-psedit/badge.svg?branch=master&service=github

