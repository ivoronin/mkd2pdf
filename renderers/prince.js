'use strict'
const ExternalRenderer = require('./external')

class PrinceRenderer extends ExternalRenderer {
    constructor () {
        super()
        this.command = 'prince'
        this.info = 'PrinceXML (https://www.princexml.com/)'
        this.css = '.markdown-body ul, .markdown-body ol { margin-left: 0 }'
        this.getCheckArgs = () => ['--version']
        this.getRenderArgs = (i, o) => [i, '-o', o] // eslint-disable-line id-length
        this.check()
    }
}

module.exports = PrinceRenderer
