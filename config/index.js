// Config entry point
const path = require('path')
const deepmerge = require('deepmerge')

// Load default settings
const defaults = require('./default')

// Which environment we are in? If not available use default.
const config = require(path.join(__dirname, (process.env.NODE_ENV || defaults.env)))

// Merge current environment settings into defaults
module.exports = deepmerge(defaults, config)
