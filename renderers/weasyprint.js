'use strict'
const ExternalRenderer = require('./external')

class WeasyPrintRenderer extends ExternalRenderer {
    constructor () {
        super()
        this.command = 'weasyprint'
        this.info = 'WeasyPrint (http://weasyprint.org/)'
        this.getCheckArgs = () => ['--version']
        this.getRenderArgs = (i, o) => ['-f', 'pdf', i, o] // eslint-disable-line id-length
        this.check()
    }
}

module.exports = WeasyPrintRenderer
