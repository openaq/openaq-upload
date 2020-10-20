# Auth0 setup
This guide outlines how to setup Auth0 for OpenAQ

## Application
Through the `Applications` menu create a new application of type `Single Page Web Applications`. Name it "OpenAq Metadata Editor".
- **Application Logo** is `https://openaq.org/assets/graphics/layout/logo.svg`.
- **Allowed Callback URLs** should be the app url + `/callback`. For the dev environment this would be `http://localhost:3000/callback`.
- **Allowed Web Origins** and **Allowed Logout URLs** should be the app url. For the dev environment this would be `http://localhost:3000`.

## API
Through the `APIs` menu create a new Api. Name it "OpenAq API".
- **Identifier** should be `http://openaq.org`. This is just used to identify the api, but it is recommended to use the url.

## Social Connections
To allow users to login through Google go to `Connections > Social` and enable the Google provider. When deploying the app to production the Google provider needs to be setup with [appropriate api keys](https://auth0.com/docs/connections/social/google) or the authentication won't persist through page refreshes. 

## Rules
Through the `Rules` menu create a new Empty Rule. Name it "User metadata".
Add the following code:
```
function (user, context, callback) {
  let uMeta = user.user_metadata || {};
  // Anything other than false is considered true.
  uMeta.active = uMeta.active !== false;
  // Include the user metadata on token response.
  context.idToken['http://openaq.org/user_metadata'] = uMeta;
  context.accessToken['http://openaq.org/user_metadata'] = uMeta;
  callback(null, user, context);
}
}
```
This rule is used to ensure that the user metadata is sent to the Application through the token.
This is what allows us to have the data needed to check whether a user is active or not.
By default all users are considered active, until `"active" = false` is added to the `user_metadata`.
To add custom data to tokens we have to use claims in url format, hence the `http://openaq.org/user_metadata`. These are just identifiers are will not be called by Auth0.

## User activation
By default the users are created as active. This allows the users to sign up through the app and have full access.
To deactivate a user, go to the user page selecting if from the list on `Users & Roles > Users`, and under `user_metadata` add `"active" = false`

----


# OpenAQ setup

## Api
The server config will need a `auth` key with the following properties:
```
"auth": {
  "strategy": "jwt",
  "audience": "<The identifier chosen for the Api. Ex: http://openaq.org>",
  "issuer": "https://<The auth0 account id. Ex: openaq-prod>.auth0.com/"
}
```
NOTE: It's imperative that the issuer has a trailing `/`.

## Frontend
The frontend config also needs a `auth` key with the following properties:
```
auth: {
  // Domain and client can be found in the Auth0 Application page.
  domain: null,
  clientID: null,
  // App url + /callback. Ex: http://localhost:3000/callback
  callbackUrl: null,
  // Audience is the identifier chosen for the Api. Ex: http://openaq.org
  audience: null
}
```
