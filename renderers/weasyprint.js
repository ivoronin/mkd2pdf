const { execFile, execFileSync } = require('child_process')
const { promisify } = require('util')

const wp_binary = 'weasyprint'

try {
    execFileSync(wp_binary, ['--version'])
} catch (err) {
    console.log('Cannot execute "%s". Please install WeasyPrint (http://weasyprint.org/)', wp_binary)
    process.exit(1)
}

function render(input, output) {
    return promisify(execFile)(wp_binary, ['-f', 'pdf', input, output])
}

exports.render = render
