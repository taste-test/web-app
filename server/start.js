#!/usr/bin/env node

require('rootpath')();

const createInstance = require('./create');
const persistInstance = require('./instance');

const options = {
    staticPaths: [
        "./browser",
        "./public"
    ],
    faviconPath: "server/app/views/favicon.ico"
};

createInstance(options).then(function(instance){
    persistInstance.set(instance);
    persistInstance.attach();
    console.log("instance started", Object.keys(instance));
})
