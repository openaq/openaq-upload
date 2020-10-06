# openaq-upload-tool

A tool to upload research-grade data to the OpenAQ platform

## Overview

The frontend of the project is a react app that lives in the `app` directory. The backend is a [serverless](https://www.serverless.com/) application which lives in the `backend` directory. 

To setup the frontend, follow directions below. To setup and deploy backend, follow directions in the [README.md](./backend/README.md) in the `backend` directory.  

## Front-end dev dependencies 

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

## Deploying 

- TODO: setup github actions or create deploy script.

1. Run `NODE_ENV=<environment> gulp build` to build a production version of the app 
2. Deploy using AWS CLI: `aws s3 sync <root>/<to>/openaq-upload/dist/ s3://<deployment bucket>`
3. Set up Cloudfront to handle routing to work with the React app 
4. TODO: document guide for setting up Cloudfront 


### Other commands
Compile the sass files, javascript... Use this instead of ```npm run serve``` if you don't want to watch.
```
$ npm run build
```

### Troubleshooting: 

- If you run into issues running `npm run serve`, you may not have the correct version of node or gulp. Please make sure you follow the steps using `nvm` above in "Getting started"

- If you follow the steps above and `npm run serve` is still not running, try tunning `npm rebuild node-sass
`. More info on this solution [here](https://stackoverflow.com/questions/55921442/how-to-fix-referenceerror-primordials-is-not-defined-in-node/58022933#58022933)
