#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
const tmp = require('tmp')
const showdown = require('showdown'),
      converter = new showdown.Converter({ tables: true })
const fileUrl = require('file-url')
const argv = require('yargs-parser')(process.argv.slice(2), {
    default: {
        template: path.join(__dirname, 'default.ejs'),
        css: fileUrl(path.join(__dirname, 'default.css')),
        renderer: 'chrome',
        language: 'en',
    },
    configuration: {
        'parse-numbers': false,
    },
})

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

if (argv._.length != 2 || !Object.keys(renderers).includes(argv.renderer)) {
    console.log('mkd2pdf [--template template.ejs] [--css url] [--renderer <chrome|prince>] [--language lang] <input.md> <output.pdf>')
    process.exit(1)
}

const renderer = require(renderers[argv.renderer].module)
var [input, output] = argv._

fs.readFile(input, 'utf-8', (err, mdown) => {
    if (err) exit(err)
    content = converter.makeHtml(mdown)
    ejs.renderFile(argv.template, { content: content, css: argv.css, language: argv.language }, (err, html) => {
        if (err) exit(err)
        tmp.file({ postfix: '.html' }, (err, pathname, fd) => {
            if (err) exit(err)
            fs.writeFile(fd, html, (err) => {
                if (err) exit(err)
                renderer.render(pathname, output).catch((err) => {
                    console.log(err)
                })
            })
        })
    })
})
