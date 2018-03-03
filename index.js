#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const ejs = require('ejs')
const tmp = require('tmp')
const showdown = require('showdown')
const fileUrl = require('file-url')
const ap = p => path.join(__dirname, p),
      apu = p => fileUrl(ap(p))
const argv = require('yargs')
    .options({
        't': { alias: 'template', describe: 'Path to custom template file', normalize: true, default: ap('default.ejs') },
        'c': { alias: 'css', describe: 'URL for custom css file', normalize: true, default: apu('default.css') },
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

const renderer = require(renderers[argv.renderer].module)
converter = new showdown.Converter()
converter.setFlavor('github')

return (async function () {
    try {
        const mdown = fs.readFileSync(argv.input, 'utf-8')
        const content = converter.makeHtml(mdown)
        const data = { content: content, css: argv.css, language: argv.language }
        const html = await promisify(ejs.renderFile)(argv.template, data)
        const tmpfile = tmp.fileSync({ postfix: '.html' })
        fs.writeFileSync(tmpfile.fd, html)
        await renderer.render(tmpfile.name, argv.output)
    } catch(err) {
        console.log('mkd2pdf:', err)
        process.exit(1)
    }
})()
