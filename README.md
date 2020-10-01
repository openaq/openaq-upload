# openaq-upload-tool

A tool to upload research-grade data to the OpenAQ platform

## Dev dependencies 

- [gulp](https://github.com/gulpjs/gulp)
- [nvm](https://github.com/nvm-sh/nvm#install-script)

## Getting started

1. Install [nvm](https://github.com/nvm-sh/nvm#install-script) 
2. Run `nvm use` and `nvm install` to install the correct version of node for the project
3. Run `npm install` to install node modules 
4. Install gulp globally `npm install -g gulp`
5. Run `npm run serve` to start project

Compiles the sass files, javascript, and launches the server making the site available at `http://localhost:3000/`
The system will watch files and execute tasks whenever one of them changes.
The site will automatically refresh since it is bundled with livereload.

### Other commands
Compile the sass files, javascript... Use this instead of ```npm run serve``` if you don't want to watch.
```
$ npm run build
```

### Troubleshooting: 

- If you run into issues running `npm run serve`, you may not have the correct version of node or gulp. Please make sure you follow the steps using `nvm` above in "Getting started"

- If you follow the steps above and `npm run serve` is still not running, try tunning `npm rebuild node-sass
`. More info on this solution [here](https://stackoverflow.com/questions/55921442/how-to-fix-referenceerror-primordials-is-not-defined-in-node/58022933#58022933)
