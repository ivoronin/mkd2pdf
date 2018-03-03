const phantom = require('phantom')
const fileUrl = require('file-url')

const dpi = 300

function render(input, output) {
    const url = fileUrl(input)
    return (async function() {
        const instance = await phantom.create()
        const page = await instance.createPage()
        await page.property('paperSize', { format: 'A4' })
        await page.property('viewportSize', {width: 800, height: 600})
        await page.property('dpi', dpi)
        await page.property('zoom', 0.645)
        const status = await page.open(url)
        await page.render(output, { format: 'pdf' })
        await instance.exit();
    })()
}

module.exports.render = render
