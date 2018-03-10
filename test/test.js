/* eslint-env node,mocha */
/* https://mochajs.org/#arrow-functions */
/* eslint-disable func-names,prefer-arrow-callback */
'use strict'
const { expect } = require('chai'),
    fs = require('fs'),
    tmp = require('tmp'),
    { execFileSync } = require('child_process')
const { DEFAULT_RENDERER, RENDERERS, getRenderer, main, parseArgs } = require('../index')

const split = (string) => string.split(' ')
describe('parseArgs', function () {
    const ALL_OPTIONS = split(`-c custom.css.ejs -l ru -r ${DEFAULT_RENDERER}` +
        ' -t custom.html.ejs input.md output.pdf')
    it('should not raise an exception when correct arguments are specified', function () {
        expect(() => parseArgs(ALL_OPTIONS)).to.not.throw()
    })
    it('should return argv object with correct values', function () {
        const argv = parseArgs(ALL_OPTIONS)
        expect(argv.css).to.equal('custom.css.ejs')
        expect(argv.language).to.equal('ru')
        expect(argv.renderer).to.equal(DEFAULT_RENDERER)
        expect(argv.template).to.equal('custom.html.ejs')
        expect(argv.input).to.equal('input.md')
        expect(argv.output).to.equal('output.pdf')
    })
    it('should raise an exception when wrong option is specified', function () {
        expect(() => parseArgs(split('-z wrong'))).to.throw()
    })
    it('should raise an exception when unsupported renderer is specified', function () {
        expect(() => parseArgs(split('-r unsupported input.md output.pdf'))).to.throw()
    })
    it('should raise an exception when wrong number of positional arguments is specified', function () {
        expect(() => parseArgs(split(''))).to.throw()
        expect(() => parseArgs(split(`-r ${DEFAULT_RENDERER}`))).to.throw()
        expect(() => parseArgs(split('input.md'))).to.throw()
        expect(() => parseArgs(split('input.md output.pdf extra.arg'))).to.throw()
    })
})

describe('getRenderer', function () {
    RENDERERS.forEach(function (renderer) {
        describe(renderer, function () {
            it('should not raise an exception when importing a supported renderer', function () {
                expect(() => getRenderer(renderer)).to.not.throw()
            })
        })
    })
})

describe('main', function () {
    RENDERERS.forEach(function (renderer) {
        describe(renderer, function () {
            this.timeout(5000) // eslint-disable-line no-magic-numbers,no-invalid-this
            const output = tmp.tmpNameSync({ postfix: '.pdf' })
            after('unlink temp files', function () {
                fs.unlinkSync(output)
            })
            it('should not raise an exception while generating pdf documents', function (done) {
                main(['-r', renderer, './example/example.md', output]).
                    then(() => done(), (err) => done(err))
            })
            const EXPECTED_SIZE = 40960
            const DELTA = 5120
            it(`generated pdf documents should be between ${EXPECTED_SIZE}±${DELTA} bytes in size`, function () {
                const stats = fs.statSync(output)
                expect(stats.size).to.be.closeTo(EXPECTED_SIZE, DELTA)
            })
            it('generated pdf documents should be recognized by file util', function () {
                const stdout = execFileSync('file', ['-b', output], { encoding: 'utf-8' })
                expect(stdout).to.match(/^PDF document, version 1\.\d/)
            })
        })
    })
})
