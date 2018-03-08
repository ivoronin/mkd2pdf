var chrome
try {
    chrome = require('chrome-headless-render-pdf')
} catch(err) {
    if (err.code === 'MODULE_NOT_FOUND') {
        console.log('Cannot find module "chrome-headless-render-pdf". Please install it with "npm install chrome-headless-render-pdf"')
        process.exit(1)
    } else {
        throw err
    }
}

const fileUrl = require('file-url')

const options = {
    noMargins: true,
    paperWidth: 8.27,
    paperHeight: 11.7,
}

class ChromeRenderer {
    render(input, output) {
        const url = fileUrl(input)
        return chrome.generateSinglePdf(url, output, options)
    }
}

module.exports.Renderer = ChromeRenderer
