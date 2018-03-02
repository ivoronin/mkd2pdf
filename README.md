# mkd2pdf
Renders markdown text in PDF using various renders.

## Install
```
$ npm i mkd2pdf
```

## Usage
```
mkd2pdf [--template template.ejs] [--css url]
        [--renderer <chrome|prince>]
        [--language lang] <input.md> <output.pdf>
```
 - **input**: Source file in Markdown format
 - **output**: Name of generated PDF file
 - **template**: Path for custom [EJS](http://ejs.co) template
 - **css**: URL for custom CSS file
 - **renderer**: HTML to PDF renderer. Default is 'chrome'.
 - **language**: Document language. Use language tags from the
                 IANA Language Subtag Registry. Default is 'en'.

## Example
![lorem ipsum](https://raw.githubusercontent.com/ivoronin/mkd2pdf/master/example/example.png)
