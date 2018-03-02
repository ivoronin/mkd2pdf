const Prince = require('prince')

function render(input, output) {
    return Prince()
        .inputs(input)
        .output(output)
        .execute()
}

module.exports.render = render
