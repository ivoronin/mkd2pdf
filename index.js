#!/usr/bin/env node
'use strict'
const ejs = require('ejs'),
    fs = require('fs'),
    path = require('path'),
    showdown = require('showdown'),
    tmp = require('tmp'),
    yargs = require('yargs'),
    { promisify } = require('util')

tmp.setGracefulCleanup()

/* Supported renderers */
const RENDERERS = ['chrome', 'prince', 'weasyprint']
const DEFAULT_RENDERER = 'chrome'
const DEFAULT_TEMPLATE = path.join(__dirname, 'default.html.ejs')

/**
 * Parses command line arguments
 * @param {array} args - Arguments array to use instead of process.argv, used by tests
 * @returns {object} Parsed arguments
 */
function parseArgs (args) {
    const parser = yargs.
        options({
            c: { alias: 'css', describe: 'Path to custom css', normalize: true },
            l: { alias: 'language', default: 'en', describe: 'Input document language', string: true },
            r: { alias: 'renderer', choices: RENDERERS, default: DEFAULT_RENDERER, describe: 'HTML to PDF renderer' },
            t: { alias: 'template', default: DEFAULT_TEMPLATE, describe: 'Path to custom template', normalize: true },
        }).
        usage('$0 <input> <output>', 'Renders markdown text documents in pdf', (cargs) => {
            cargs.positional('input', { describe: 'Path to input markdown document', type: 'string' })
            cargs.positional('output', { describe: 'Path to output pdf document', type: 'string' })
            cargs.example('$0 input.md output.pdf', 'Converts "input.md" to "output.pdf"')
        }).
        help('h').
        alias('h', 'help').
        // eslint-disable-next-line lines-around-comment,no-inline-comments
        /* https://github.com/yargs/yargs/issues/1076 */
        // eslint-disable-next-line no-confusing-arrow
        check((argv) => argv._.length ? 'Too many positional arguments were passed' : true).
        strict(true).
        wrap(yargs.terminalWidth())
    if (args) {
        /* This codepath is reachable only by tests */
        return parser.
            fail((msg, err) => {
                if (err) {
                    throw err
                }
                throw Error(msg)
            }).
            parse(args)
    }
    return parser.argv
}

/**
 * Imports renderer module
 * @param {string} rendererName - Renderer module name
 * @returns {object} Renderer instance
 */
function getRenderer (rendererName) {
    const Renderer = require(`./renderers/${rendererName}`) // eslint-disable-line global-require
    return new Renderer()
}

/**
 * Synchronously makes a new temporary HTML file and writes content into it.
 * @param {string} html - HTML content
 * @returns {string} File pathname
 */
function createTempHTMLFileSync (html) {
    /* File will be deleted on exit */
    const tmpfile = tmp.fileSync({ postfix: '.html' })
    fs.writeFileSync(tmpfile.fd, html)
    return tmpfile.name
}

/**
 * @param {array} args - Arguments array to use instead of process.argv, used by tests
 * @returns {undefined}
 */
async function main (args) {
    const argv = parseArgs(args)
    const renderer = getRenderer(argv.renderer)
    const converter = new showdown.Converter()
    converter.setFlavor('github')
    const markdown = fs.readFileSync(argv.input, 'utf-8')
    const content = converter.makeHtml(markdown)
    const html = await promisify(ejs.renderFile)(argv.template, {
        content,
        custom_css_path: argv.css, // eslint-disable-line camelcase
        language: argv.language,
        renderer_css: renderer.css, // eslint-disable-line camelcase
    })
    const tmpfile = createTempHTMLFileSync(html)
    await renderer.render(tmpfile, argv.output)
}

/* Detect if called directly */
if (require.main === module) {
    (async () => {
        try {
            await main()
        } catch (err) {
            console.error('mkd2pdf: %s', err) // eslint-disable-line no-console
            process.exit(1) // eslint-disable-line no-process-exit,no-magic-numbers
        }
    })()
} else {
    /* Export functions for testing purposes */
    module.exports = {
        DEFAULT_RENDERER,
        RENDERERS,
        createTempHTMLFileSync,
        getRenderer,
        main,
        parseArgs,
    }
}
