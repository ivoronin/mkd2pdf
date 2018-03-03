var Prince
try {
    Prince = require('prince')
} catch(err) {
    if (err.code === 'MODULE_NOT_FOUND') {
        console.log('Cannot find module "prince". Please install it with "npm install prince"')
        process.exit(1)
    } else {
        throw err
    }
}

function render(input, output) {
    return Prince()
        .inputs(input)
        .output(output)
        .execute()
}

module.exports.render = render
