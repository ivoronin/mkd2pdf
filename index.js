#!/usr/bin/env node
'use strict'
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const ejs = require('ejs')
const tmp = require('tmp')
const showdown = require('showdown')
const yargs = require('yargs')

const renderers = ['chrome', 'prince', 'weasyprint']

tmp.setGracefulCleanup()

/**
 * Parses command line arguments
 * @param {array} args - Arguments array to use instead of process.argv
 * @returns {object} Parsed arguments
 */
function parse_args(args) {
    /* path to absolute path */
    const ap = p => path.join(__dirname, p)
    const parser = yargs
        .options({
            't': { alias: 'template', describe: 'Path to custom template file', normalize: true, default: ap('default.html.ejs') },
            'c': { alias: 'css', describe: 'Path to custom css file', normalize: true },
            'r': { alias: 'renderer', describe: 'HTML to PDF renderer', choices: renderers, default: 'chrome' },
            'l': { alias: 'language', describe: 'Input document language', string: true, default: 'en' },
        })
        .usage('$0 <input> <output>', 'Renders markdown text documents in pdf', (yargs) => {
            yargs.positional('input', { describe: 'Path to input markdown document', type: 'string' })
            yargs.positional('output', { describe: 'Path to output pdf document', type: 'string' })
            yargs.example('$0 input.md output.pdf', 'Converts "input.md" to "output.pdf"')
        })
        .help('h')
        .alias('h', 'help')
        /* https://github.com/yargs/yargs/issues/1076 */
        .check((argv, opts) => argv._.length ? 'Too many positional arguments were passed' : true)
        .strict(true)
        .wrap(yargs.terminalWidth())
    return args ? parser.parse(args) : parser.argv
}

/**
 * Imports renderer module
 * @param {string} renderer_name - Renderer module name
 * @returns {object} Renderer instance
 */
function getRenderer(renderer_name) {
    const Renderer = require('./renderers/' + renderer_name)
    return new Renderer()
}

/**
 * Synchronously makes a new temporary HTML file and writes content into it.
 * @param {string} html - HTML content
 * @returns {string} File pathname
 */
function createTempHTMLFileSync(html) {
    /* file will be deleted on exit */
    const tmpfile = tmp.fileSync({ postfix: '.html' })
    fs.writeFileSync(tmpfile.fd, html)
    return tmpfile.name
}

/**
 * @param {array} args - Arguments array to use instead of process.argv
 */
async function main (args) {
    const argv = parse_args(args)
    const renderer = getRenderer(argv.renderer)
    const converter = new showdown.Converter()
    converter.setFlavor('github')
    const markdown = fs.readFileSync(argv.input, 'utf-8')
    const content = converter.makeHtml(markdown)
    const html = await promisify(ejs.renderFile)(argv.template, {
        content: content,
        language: argv.language,
        renderer_css: renderer.css,
        custom_css_path: argv.css,
    })
    const tmpfile = createTempHTMLFileSync(html)
    await renderer.render(tmpfile, argv.output)
}

/* Detect if called directly */
if (require.main === module) {
    (async () => {
        try {
            await main()
        } catch(err) {
            console.log('mkd2pdf: %s', err)
            process.exit(1)
        }
    })()
}
