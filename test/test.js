/* eslint-env node,mocha */
/* https://mochajs.org/#arrow-functions */
/* eslint-disable func-names,prefer-arrow-callback */
'use strict'
const { expect } = require('chai'),
    fs = require('fs'),
    tmp = require('tmp'),
    { execFileSync } = require('child_process')
const {
    DEFAULT_GENERATOR, DEFAULT_LANGUAGE, DEFAULT_RENDERER, DEFAULT_TEMPLATE, RENDERERS,
    convertMarkdownToHTML, getRenderer, main, parseArgs,
} = require('../index')

const split = (string) => string.split(' ')
describe('parseArgs', function () {
    const EXPECTED_CSS = 'custom.css.ejs',
        EXPECTED_INPUT = 'input.md',
        EXPECTED_LANGUAGE = 'ru',
        EXPECTED_OUTPUT = 'output.pdf',
        EXPECTED_RENDERER = 'prince',
        EXPECTED_TEMPLATE = 'custom.html.ejs'
    const ARGUMENTS = split(`-c ${EXPECTED_CSS} -l ${EXPECTED_LANGUAGE} -r ${EXPECTED_RENDERER}` +
        ` -t ${EXPECTED_TEMPLATE} ${EXPECTED_INPUT} ${EXPECTED_OUTPUT}`)
    it('should not raise an exception when correct arguments are specified', function () {
        expect(() => parseArgs(ARGUMENTS)).to.not.throw()
    })
    it('should return argv object with expected values', function () {
        const argv = parseArgs(ARGUMENTS)
        expect(argv.css).to.equal(EXPECTED_CSS)
        expect(argv.language).to.equal(EXPECTED_LANGUAGE)
        expect(argv.renderer).to.equal(EXPECTED_RENDERER)
        expect(argv.template).to.equal(EXPECTED_TEMPLATE)
        expect(argv.input).to.equal(EXPECTED_INPUT)
        expect(argv.output).to.equal(EXPECTED_OUTPUT)
    })
    it('should return argv object with expected default values', function () {
        const argv = parseArgs(split(`${EXPECTED_INPUT} ${EXPECTED_OUTPUT}`))
        expect(argv.css).to.be.an('undefined')
        expect(argv.language).to.equal(DEFAULT_LANGUAGE)
        expect(argv.renderer).to.equal(DEFAULT_RENDERER)
        expect(argv.template).to.equal(DEFAULT_TEMPLATE)
        expect(argv.input).to.equal(EXPECTED_INPUT)
        expect(argv.output).to.equal(EXPECTED_OUTPUT)
    })
    it('should raise an exception when wrong option is specified', function () {
        expect(() => parseArgs(split('-z wrong'))).to.throw()
    })
    it('should raise an exception when unsupported renderer is specified', function () {
        expect(() => parseArgs(split(`-r unsupported ${EXPECTED_INPUT} ${EXPECTED_OUTPUT}`))).to.throw()
    })
    it('should raise an exception when wrong number of positional arguments is specified', function () {
        expect(() => parseArgs(split(''))).to.throw()
        expect(() => parseArgs(split(`-r ${DEFAULT_RENDERER}`))).to.throw()
        expect(() => parseArgs(split(`${EXPECTED_INPUT}`))).to.throw()
        expect(() => parseArgs(split(`${EXPECTED_INPUT} ${EXPECTED_OUTPUT} extra.arg`))).to.throw()
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

describe('convertMarkdownToHTML', function () {
    const MARKDOWN_METADATA =
        '---\n' +
        'title: lorem\n' +
        'description: ipsum\n' +
        '---\n' +
        '\n'
    const MARKDOWN_TEXT =
        '# Dolor sit ameta\n' +
        'consectetuer adipiscing elit\n'
    const EXPECTED_CONTENT = '<h1 id="dolor-sit-ameta">Dolor sit ameta</h1>\n<p>consectetuer adipiscing elit</p>'
    const EXPECTED_TITLE = 'lorem'
    const EXPECTED_METADATA = { description: 'ipsum', generator: DEFAULT_GENERATOR }
    const EXPECTED_DEFAULT_METADATA = { generator: DEFAULT_GENERATOR }
    it('converted document with metadata should match expected one', function () {
        const document = convertMarkdownToHTML(MARKDOWN_METADATA + MARKDOWN_TEXT)
        expect(document.content).to.equal(EXPECTED_CONTENT)
        expect(document.title).to.equal(EXPECTED_TITLE)
        expect(document.metadata).to.deep.equal(EXPECTED_METADATA)
    })
    it('converted document without metadata should match expected one', function () {
        const document = convertMarkdownToHTML(MARKDOWN_TEXT)
        expect(document.content).to.equal(EXPECTED_CONTENT)
        expect(document.title).to.be.an('undefined')
        expect(document.metadata).to.deep.equal(EXPECTED_DEFAULT_METADATA)
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
            const EXPECTED_SIZE = 39936
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
