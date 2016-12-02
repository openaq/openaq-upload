# OpenAQ Uploader Page
A page used to upload CSV data to the OpenAQ project, which checks the data against rules in a JSON schema and delivers helpful error messages in cases of nonconformance.

## Development environment
To set up the development environment for this website, you'll need to install the following on your system:

- Node (v4.2.x) & Npm ([nvm](https://github.com/creationix/nvm) usage is advised)

> The versions mentioned are the ones used during development. It could work with newer ones.

After these basic requirements are met, run the following commands in the website's folder:
```
$ npm install
```

## Development environment (server)
This site depends on the server to acquire credentials for uploading to S3. At present, it sends
a file name to an API which returns the parameters necessary to sign an AWS S3 upload submission form, as listed  below:
```
data.append('acl', params.acl);
data.append('key', params.key);
data.append('policy', params.policy);
data.append('success_action_status', params['success_action_status']);
data.append('x-amz-algorithm', params['x-amz-algorithm']);
data.append('x-amz-credential', params['x-amz-credential']);
data.append('x-amz-date', params['x-amz-date']);
data.append('x-amz-signature', params['x-amz-signature']);
data.append('file', file);
```

In production, this API will integrated with the larger OpenAQ project, but a development server can be launched locally from the __server__ directory of this project. After running `npm install` in the __server__ directory, the server can be launched using the command `env S3_ACCESS_KEY=xxx S3_SECRET_KEY=xxx S3_BUCKET=xxx S3_REGION=xxx node server.js`, with the credentials to the desired S3 bucket. The bucket will need to have a CORS policy permissive of uploads from localhost. The server launches on port 5000, which is the endpoint used in this development version of the upload form.

### Getting started

```
$ npm run serve
```
Compiles the sass files, javascript, and launches the server making the site available at `http://localhost:3000/` The system will watch files and execute tasks whenever one of them changes. The site will automatically refresh since it is bundled with livereload.

### Other commands
Compile the sass files, javascript... Use this instead of ```npm run serve``` if you don't want to watch.
```
$ npm run build
```
