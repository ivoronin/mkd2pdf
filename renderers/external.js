'use strict'
const { execFileSync } = require('child_process')
const { format } = require('util')

class ExternalRenderer {
    check () {
        try {
            execFileSync(this.command, this.getCheckArgs())
        } catch (err) {
            throw Error(format('Cannot execute "%s". Plese install %s', this.command, this.info))
        }
    }

    async render (input, output) { // eslint-disable-line require-await
        return execFileSync(this.command, this.getRenderArgs(input, output), { stdio: 'ignore' })
    }
}

module.exports = ExternalRenderer
