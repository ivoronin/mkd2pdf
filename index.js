#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const ejs = require('ejs')
const tmp = require('tmp')
const showdown = require('showdown')
const yargs = require('yargs')

const ap = p => path.join(__dirname, p)
const argv = yargs
    .options({
        't': { alias: 'template', describe: 'Path to custom template file', normalize: true, default: ap('default.html.ejs') },
        'c': { alias: 'css', describe: 'Path to custom css file', normalize: true, default: ap('default.css.ejs') },
        'r': { alias: 'renderer', describe: 'HTML to PDF renderer', choices: ['chrome', 'prince', 'weasyprint', 'wkhtmltopdf'], default: 'chrome' },
        'l': { alias: 'language', describe: 'Input document language', string: true, default: 'en' },
    })
    .usage('$0 <input> <output>', 'Renders markdown text documents in pdf', (yargs) => {
        yargs.positional('input', { describe: 'Path to input markdown document', type: 'string' })
        yargs.positional('output', { describe: 'Path to output pdf document', type: 'string' })
        yargs.example('$0 input.md output.pdf', 'Converts \'input.md\' to \'output.pdf\'')
    })
    .help('h')
    .alias('h', 'help')
    /* https://github.com/yargs/yargs/issues/1076 */
    .check((argv, opts) => {
        return argv._.length ? "Too many positional arguments were passed" : true
    })
    .strict(true)
    .wrap(yargs.terminalWidth())
    .argv

const renderer = require('./renderers/' + argv.renderer)
const converter = new showdown.Converter()
converter.setFlavor('github')

return (async function () {
    try {
        const markdown = fs.readFileSync(argv.input, 'utf-8')
        const content = converter.makeHtml(markdown)
        const style = await promisify(ejs.renderFile)(argv.css, {
            renderer_css: renderer.css,
        })
        const html = await promisify(ejs.renderFile)(argv.template, {
            content: content,
            style: style,
            language: argv.language,
        })
        const tmpfile = tmp.fileSync({ postfix: '.html' })
        fs.writeFileSync(tmpfile.fd, html)
        await renderer.render(tmpfile.name, argv.output)
    } catch(err) {
        console.log('mkd2pdf:', err)
        process.exit(1)
    }
})()
