# mkd2pdf
Renders markdown text in PDF using various renderers.

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
Optionally install [Prince](https://www.princexml.com/) renderer:
```bash
npm install prince
```
Optionally install [WeasyPrint](http://weasyprint.org/) renderer:
```bash
pip3 install weasyprint
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
|-|-|-|
| Google Chrome | <ul><li>Free</li> | <ul><li>Intermittent errors, long startup time</li><li>Page header and footer generation is disabled because of hardcoded contents (local file name, title and date)</li></ul> |
| [Prince](https://www.princexml.com/) | <ul><li>Stable and fast</li><li>Supports automatic hyphenation</li></ul> | <ul><li>Adds a small logo to the first page of generated PDF files when used with free/non-commercial license.</li></ul> |
| [WeasyPrint](http://weasyprint.org/) | <ul><li>Open Source</li><li>Supports automatic hyphenation</li></ul> | <ul><li>None known |

## License
This project is licensed under the MIT License
