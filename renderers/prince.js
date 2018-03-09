const ExternalRenderer = require('./external')

class PrinceRenderer extends ExternalRenderer {
    constructor() {
        super()
        this.command = 'prince'
        this.info = 'PrinceXML (https://www.princexml.com/)'
        this.css = '.markdown-body ul, .markdown-body ol { margin-left: 0 }'
        this.get_check_args = () => ['--version']
        this.get_render_args = (i,o) => [i, '-o', o]
        this.check()
    }
}

module.exports = PrinceRenderer
