const { execFileSync, execFile } = require('child_process')
const { format } = require('util')

class ExternalRenderer {
    check() {
        try {
            execFileSync(this.command, this.get_check_args())
        } catch (err) {
            throw Error(format('Cannot execute "%s". Plese install %s', this.command, this.info))
        }
    }

    async render(input, output) {
        return execFileSync(this.command, this.get_render_args(input, output))
    }
}

module.exports.ExternalRenderer = ExternalRenderer
