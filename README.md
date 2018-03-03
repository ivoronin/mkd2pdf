# mkd2pdf
Renders markdown text in PDF using various renderers.

## Prerequisites
 - Node.js ^9.0.0
 - Chrome >=65.0.0 or [Prince](https://www.princexml.com/) >=11.0

## Installing
```bash
mkdir mkd2pdf && cd mkd2pdf
npm install mkd2pdf
sudo npm link
# Optionally install prince renderer
npm install prince
```

## Usage
Please refer to `mkd2pdf --help`

## Example
![lorem ipsum](https://raw.githubusercontent.com/ivoronin/mkd2pdf/master/example/example.png)

## Supported Renderers
 - Google Chrome (in headless mode):
     - Pros:
         - Free
     - Cons:
         - Intermittent errors, long startup time
         - Page header and footer generation is disabled because of hardcoded contents (local file name, title and date)
 - [Prince](https://www.princexml.com/):
     - Pros:
         - Stable and fast
         - Supports automatic hyphenation (**please specify the correct language**).
     - Cons:
         - Adds a small logo to the first page of generated PDF files when used with free/non-commercial license.

## License
This project is licensed under the MIT License
