const { ExternalRenderer } = require('./external')

class WeasyPrintRenderer extends ExternalRenderer {
    constructor() {
        super()
        this.command = 'weasyprint'
        this.info = 'WeasyPrint (http://weasyprint.org/)'
        this.get_check_args = () => ['--version']
        this.get_render_args = (i,o) => ['-f', 'pdf', i, o]
        this.check()
    }
}

module.exports.Renderer = WeasyPrintRenderer
