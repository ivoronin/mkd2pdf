const { execFile, execFileSync } = require('child_process')
const { promisify } = require('util')

const wkhtmltopdf_binary = 'wkhtmltopdf'

try {
    execFileSync(wkhtmltopdf_binary, ['--version'])
} catch (err) {
    console.log('Cannot execute "%s". Please install wkhtmltopdf (https://wkhtmltopdf.org/)', wkhtmltopdf_binary)
    process.exit(1)
}

function render(input, output) {
    return promisify(execFile)(wkhtmltopdf_binary, ['-L', '3cm','-R', '1.5cm', '-B', '2cm', '-T', '2cm', input, output])
}

exports.render = render
