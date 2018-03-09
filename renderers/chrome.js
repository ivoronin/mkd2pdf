'use strict'
let chrome // eslint-disable-line init-declarations
try {
    chrome = require('chrome-headless-render-pdf') // eslint-disable-line global-require
} catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
        throw Error('Cannot find module "chrome-headless-render-pdf".' +
                    'Please install it with "npm install chrome-headless-render-pdf"')
    } else {
        throw err
    }
}

const fileUrl = require('file-url')

const options = {
    noMargins: true,
    paperHeight: 11.7,
    paperWidth: 8.27,
}

class ChromeRenderer {
    render (input, output) { // eslint-disable-line class-methods-use-this
        const url = fileUrl(input)
        return chrome.generateSinglePdf(url, output, options)
    }
}

module.exports = ChromeRenderer
