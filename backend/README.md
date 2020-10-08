# OpenAQ Upload Tool backend 

Note: The backend for this project is built using the [Serverless](https://serverless.com) framework, and is built on top of their custom authorizers starter code. View the original repo [here](https://github.com/serverless/examples/tree/master/aws-node-auth0-custom-authorizers-api) 

This is an example of how to protect API endpoints with [auth0](https://auth0.com/), JSON Web Tokens (jwt) and a [custom authorizer lambda function](https://serverless.com/framework/docs/providers/aws/events/apigateway#http-endpoints-with-custom-authorizers).

## Setup

1. `npm install` json web token dependencies

2. Log into [auth0 application](https://auth0.com/docs/applications) for the project.

3. Get the `Client ID` (under `applications->${YOUR_APP_NAME}->settings`) and plugin your `AUTH0_CLIENT_ID` in a new file called `secrets.json` (based on `secrets.example.json`).

4. Get the `public key` (under `applications->${YOUR_APP_NAME}->settings->Show Advanced Settings->Certificates->DOWNLOAD CERTIFICATE`). Download it as `PEM` format and save it as a new file called `public_key`

## Deployment

1. Check that the upload S3 bucket for the project exists in the AWS account. By default this will be named `upload-tool-bucket-<stage>`. 

2. Deploy the service with `serverless deploy --stage <stage-name>` and grab the public and private endpoints. By default it will deploy to the `dev` stage.

3. Upon successful deployment, in your console serverless will print the private HTTP endpoint. This endpoint will live in the [config folder](../app/scripts/config) for the relevant stage as `uploadUrl`.

## Testing

This project uses [custom authorizers functions](https://aws.amazon.com/blogs/compute/introducing-custom-authorizers-in-amazon-api-gateway/) which is executed before the upload function is executed and return an Error or a Policy document.

You can either test by 1) testing lambda directly in the AWS console, or 2) by sending a HTTP POST request to the `/private` endpoint. 

When testing, you can generate an auth token by logging into auth0 and retrieving the token. This will be the JWT token used with the `Bearer <TOKEN>`.

