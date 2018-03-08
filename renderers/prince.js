const { execFile, execFileSync } = require('child_process')
const { promisify } = require('util')

const prince_binary = 'prince'

try {
    execFileSync(prince_binary, ['--version'])
} catch (err) {
    console.log('Cannot execute "%s". Please install PrinceXML (https://www.princexml.com/)', prince_binary)
    process.exit(1)
}

function render(input, output) {
    return promisify(execFile)(prince_binary, [input, '-o', output])
}

exports.render = render
module.exports.css = ".markdown-body ul, .markdown-body ol { margin-left: 0 }"
