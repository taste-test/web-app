#!/usr/bin/env node

require('rootpath')();

const createInstance = require('./create');
const persistInstance = require('./instance');

createInstance().then(function(instance){
    persistInstance.set(instance);
    persistInstance.attach();
})
