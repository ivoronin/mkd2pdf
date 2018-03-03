#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
const tmp = require('tmp')
const showdown = require('showdown')
const fileUrl = require('file-url')
const argv = require('yargs')
    .options({
        't': { alias: 'template', describe: 'Path to custom template file', normalize: true, default: path.join(__dirname, 'default.ejs') },
        'c': { alias: 'css', describe: 'URL for custom css file', normalize: true, default: fileUrl(path.join(__dirname, 'default.css')) },
        'r': { alias: 'renderer', describe: 'HTML to PDF renderer', choices: ['chrome', 'prince'], default: 'chrome' },
        'l': { alias: 'language', describe: 'Input document language', string: true, default: 'en' },
    })
    .usage('$0 <input> <output>', 'Renders markdown text documents in pdf', (yargs) => {
        yargs.positional('input', { describe: 'Path to input markdown document', type: 'string' })
        yargs.positional('output', { describe: 'Path to output pdf document', type: 'string' })
    })
    .help('h')
    /* https://github.com/yargs/yargs/issues/1076 */
    .check((argv, opts) => {
        return argv._.length ? "Too many positional arguments were passed" : true
    })
    .strict(true)
    .argv

const renderers = {
    chrome: {
        module: './renderers/chrome',
    },
    prince: {
        module: './renderers/prince',
    },
}

function exit(err) {
    console.log('mkd2pdf: %s', err)
    process.exit(2)
}

const renderer = require(renderers[argv.renderer].module)
converter = new showdown.Converter()
converter.setFlavor('github')

fs.readFile(argv.input, 'utf-8', (err, mdown) => {
    if (err) exit(err)
    const content = converter.makeHtml(mdown)
    ejs.renderFile(argv.template, { content: content, css: argv.css, language: argv.language }, (err, html) => {
        if (err) exit(err)
        tmp.file({ postfix: '.html' }, (err, pathname, fd) => {
            if (err) exit(err)
            fs.writeFile(fd, html, (err) => {
                if (err) exit(err)
                renderer.render(pathname, argv.output).catch((err) => {
                    console.log(err)
                })
            })
        })
    })
})
