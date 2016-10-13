'use strict';

const send = require('./src/sendapi');
const userprofile = require('./src/userprofile');
const thread = require('./src/threadsettings');

for (let exp in send) {
    exports[exp] = send[exp];
}

for (let exp in thread) {
    exports[exp] = thread[exp];
}

for (let exp in userprofile) {
    exports[exp] = userprofile[exp];
}

