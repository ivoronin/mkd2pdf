const chrome =  require('chrome-headless-render-pdf')
const fileUrl = require('file-url')

const options = {
    noMargins: true,
    paperWidth: 8.27,
    paperHeight: 11.7,
}

function render(input, output) {
    url = fileUrl(input)
    return chrome.generateSinglePdf(url, output, options)
}

module.exports.render = render
