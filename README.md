# mkd2pdf
Renders markdown text in PDF using various renderers.

[![hit count](http://hits.dwyl.io/ivoronin/mkd2pdf.svg)](http://hits.dwyl.io/ivoronin/mkd2pdf) [![npm version](https://badge.fury.io/js/mkd2pdf.svg)](https://badge.fury.io/js/mkd2pdf)

## Prerequisites
 - Node.js >= 9.0.0
 - One or more of the following software products:
     - Google Chrome >= 65.0.0
     - [Prince](https://www.princexml.com/) >= 11.0
     - [WeasyPrint](http://weasyprint.org/) >= 0.42.2

## Installing
```bash
mkdir mkd2pdf && cd mkd2pdf
npm install mkd2pdf
sudo npm link
```

## Usage
```bash
mkd2pdf input.md output.pdf
```
Please refer to `mkd2pdf --help` for more information.

## Example
![lorem ipsum](https://raw.githubusercontent.com/ivoronin/mkd2pdf/master/example/example.png)

## Supported Renderers
| Renderer | Pros | Cons |
|---|---|---|
| Google Chrome | <ul><li>Free</li> | <ul><li>Intermittent errors, long startup time</li><li>Page header and footer generation is disabled because of hardcoded contents (local file name, title and date)</li><li>Does not generate bookmarks</li><li>Does not support metadata</li></ul> |
| [Prince](https://www.princexml.com/) | <ul><li>Stable and fast</li><li>Supports automatic hyphenation</li></ul> | <ul><li>Adds a small logo to the first page of generated PDF files when used with free/non-commercial license.</li></ul> |
| [WeasyPrint](http://weasyprint.org/) | <ul><li>Open Source</li><li>Supports automatic hyphenation</li></ul> | <ul><li>A few HTML rendering shortcomings</li></ul> |

## License
This project is licensed under the MIT License
