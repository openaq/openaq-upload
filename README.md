# OpenAQ Upload Tool

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

1. Run `NODE_ENV=<environment> gulp build` to build a production version of the app 
2. Deploy using AWS CLI: `aws s3 sync <root>/<to>/openaq-upload/dist/ s3://<deployment bucket>`
3. Set up Cloudfront to handle routing to work with the React app 


## Gists 

- This project uses react-gist to display the markdown format document for the upload tool. This is currently set to [this link](https://gist.github.com/dqgorelick/c98a8721d2ec59d6242d714018e2a0e7), but can be changed, and added to the files in `app/assets/scripts/config`. This gist should reflect what exists in the [openAQ data format](https://github.com/openaq/openaq-data-format) repository, under `upload`. 


## Setting correct permissions on S3 upload bucket

It is **crucial** to make sure the S3 upload bucket is set up correctly for this application will work. Save yourself a lot of time to check the following. **Note** The upload bucket is where the data live, this is a different bucket than the front-end deployment bucket.

- The S3 bucket is created, and shared the name with the `BUCKET` env variable created. Typically this will be `upload-tool-bucket-<STAGE>`
- The S3 bucket will need to be public for reading. This allows the fetch adapter to have access to ingest the JSON data that is added.
- The S3 bucket must have the serverless IAM role be a principle

An example policy to attach to the **front-end bucket**

```
{
   "Version":"2012-10-17",
   "Id":"policy",
   "Statement":[
      {
         "Effect":"Allow",
         "Principal":"*",
         "Action":[
            "s3:List*",
            "s3:Get*"
         ],
         "Resource":[
            "arn:aws:s3:::bucket-name/*",
            "arn:aws:s3:::bucket-name"
         ]
      }
   ]
}
```

An example policy to attach to the **upload S3 bucket**

```
{
   "Version":"2012-10-17",
   "Id":"policy",
   "Statement":[
       {
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:List*",
                "s3:Get*"
            ],
            "Resource": [
                "arn:aws:s3:::upload-tool-bucket-<STAGE>/*",
                "arn:aws:s3:::upload-tool-bucket-<STAGE>"
            ]
        },
        {
            "Action": [
                "s3:*"
            ],
            "Effect": "Allow",
            "Resource": [
                "arn:aws:s3:::upload-tool-bucket-<STAGE>/*"
            ],
            "Principal": {
                "AWS": [
                    "arn:aws:iam::337884027122:role/openaq-upload-tool-<STAGE>-us-east-1-lambdaRole"
                ]
            }
        }
   ]
}
```

### Other commands
Compile the sass files, javascript... Use this instead of ```npm run serve``` if you don't want to watch.
```
$ npm run build
```

### Troubleshooting: 

- If you run into issues running `npm run serve`, you may not have the correct version of node or gulp. Please make sure you follow the steps using `nvm` above in "Getting started"

- If you follow the steps above and `npm run serve` is still not running, try tunning `npm rebuild node-sass
`. More info on this solution [here](https://stackoverflow.com/questions/55921442/how-to-fix-referenceerror-primordials-is-not-defined-in-node/58022933#58022933)
