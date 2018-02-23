#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
const tmp = require('tmp')
const showdown = require('showdown'),
      converter = new showdown.Converter({ tables: true })
const renderer =  require('chrome-headless-render-pdf')
const fileUrl = require('file-url')
const argv = require('yargs-parser')(process.argv.slice(2), {
    default: {
        template: path.join(__dirname, 'default.ejs'),
        css: fileUrl(path.join(__dirname, 'default.css')),
    },
    configuration: {
        'parse-numbers': false,
    },
})

const rendererOptions = {
    noMargins: true,
    paperWidth: 8.27,
    paperHeight: 11.7,
    printLogs: true,
}

function exit(err) {
    console.log('mkd2pdf: %s', err)
    process.exit(2)
}

if (argv._.length != 2) {
    console.log('mkd2pdf [--template template.ejs] [--css url] <input.md> <output.pdf>')
    process.exit(1)
}

var [input, output] = argv._

fs.readFile(input, 'utf-8', (err, mdown) => {
    if (err) exit(err)
    content = converter.makeHtml(mdown)
    ejs.renderFile(argv.template, { content: content, css: argv.css }, (err, html) => {
        if (err) exit(err)
        tmp.file({ postfix: '.html' }, (err, pathname, fd) => {
            if (err) exit(err)
            fs.writeFile(fd, html, (err) => {
                if (err) exit(err)
                url = fileUrl(pathname)
                renderer.generateSinglePdf(url, output,  rendererOptions)
            })
        })
    })
})
