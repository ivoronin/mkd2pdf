#!/usr/bin/env node
'use strict'
const ejs = require('ejs'),
    fs = require('fs'),
    path = require('path'),
    showdown = require('showdown'),
    tmp = require('tmp'),
    yargs = require('yargs'),
    { promisify } = require('util'),
    { version } = require('./package.json')

tmp.setGracefulCleanup()

/* Supported renderers */
const RENDERERS = ['chrome', 'prince', 'weasyprint']

/* Defaults */
const DEFAULT_RENDERER = 'chrome'
const DEFAULT_TEMPLATE = path.join(__dirname, 'default.html.ejs')
const DEFAULT_LANGUAGE = 'en'
const DEFAULT_GENERATOR = `mkd2pdf ${version} (https://github.com/ivoronin/mkd2pdf/)`

/**
 * Parses command line arguments
 * @param {array} args - Arguments array to use instead of process.argv, used by tests
 * @returns {object} Parsed arguments
 */
function parseArgs (args) {
    const parser = yargs.
        options({
            c: { alias: 'css', describe: 'Path to custom css', normalize: true },
            l: { alias: 'language', default: DEFAULT_LANGUAGE, describe: 'Input document language', string: true },
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
 * Metadata handling
 * https://www.princexml.com/doc/pdf-metadata/
 * https://github.com/Kozea/WeasyPrint/blob/master/weasyprint/document.py (/class DocumentMetadata)
 * @param {object} converter - Showdown converter instance
 * @returns {object} Title, Metadata
 */
function getMarkdownMetadata (converter) {
    const hasKey = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)
    const metadata = converter.getMetadata()
    const { title } = metadata
    if (hasKey(metadata, 'title')) {
        delete metadata.title
    }
    if (!hasKey(metadata, 'generator')) {
        metadata.generator = DEFAULT_GENERATOR
    }
    return { metadata, title }
}

/**
 * Converts markdown to html
 * @param {string} markdown - Markdown document
 * @returns {object} - Converted document
 */
function convertMarkdownToHTML (markdown) {
    const converter = new showdown.Converter({ metadata: true })
    converter.setFlavor('github')
    const content = converter.makeHtml(markdown)
    const { title, metadata } = getMarkdownMetadata(converter)
    return { content, metadata, title }
}

/**
 * @param {array} args - Arguments array to use instead of process.argv, used by tests
 * @returns {Promise} Promise
 */
async function main (args) {
    const argv = parseArgs(args)
    const renderer = getRenderer(argv.renderer)
    const markdown = fs.readFileSync(argv.input, 'utf-8')
    const document = convertMarkdownToHTML(markdown)
    const html = await promisify(ejs.renderFile)(argv.template, {
        basedir: __dirname,
        content: document.content,
        custom_css_path: argv.css, // eslint-disable-line camelcase
        language: argv.language,
        metadata: document.metadata,
        renderer_css: renderer.css, // eslint-disable-line camelcase
        title: document.title,
    })
    const tmpfile = tmp.fileSync({ postfix: '.html' })
    fs.writeFileSync(tmpfile.fd, html)
    await renderer.render(tmpfile.name, argv.output)
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
        DEFAULT_GENERATOR,
        DEFAULT_LANGUAGE,
        DEFAULT_RENDERER,
        DEFAULT_TEMPLATE,
        RENDERERS,
        convertMarkdownToHTML,
        getRenderer,
        main,
        parseArgs,
    }
}
