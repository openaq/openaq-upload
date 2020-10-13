const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const moment = require('moment');

// Set in `environment` of serverless.yml
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_PUBLIC_KEY = process.env.AUTH0_CLIENT_PUBLIC_KEY;
const DB_REGION = process.env.DB_REGION;
const UPLOAD_BUCKET = process.env.BUCKET;
const LOGGING_TABLE = process.env.TABLE;

const s3 = new AWS.S3();
const ddb = new AWS.DynamoDB({region: DB_REGION});

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

// Reusable Authorizer function, set on `authorizer` field in serverless.yml
module.exports.auth = (event, context, callback) => {
  if (!event.authorizationToken) {
    return callback('Unauthorized');
  }

  const tokenParts = event.authorizationToken.split(' ');
  const tokenValue = tokenParts[1];

  if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
    // no auth token!
    return callback('Unauthorized');
  }
  const options = {
    aud: AUTH0_CLIENT_ID,
  };

  try {
    jwt.verify(tokenValue, AUTH0_CLIENT_PUBLIC_KEY, options, (verifyError, decoded) => {
      if (verifyError) {
        // 401 Unauthorized
        return callback('Unauthorized');
      }
      // is custom authorizer function
      return callback(null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
    });
  } catch (err) {
    return callback('Unauthorized');
  }
};

// Private API
module.exports.uploadData = (event, context, callback) => {
  const dateString = new Date().toISOString()
  const body = JSON.parse(event.body)
  s3.putObject(
    {
      Bucket: UPLOAD_BUCKET,
      Key: `uploaded_${dateString}.csv`,
      Body: body.data,
      ContentType: "application/octet-stream"
    },
    function (err, data) {
      if (err) {
        callback(`Unauthorized, please log in ${JSON.stringify(err)}`)
      } else {
        // upload entry to logging DB 
        var tableParams = {
          TableName: LOGGING_TABLE,
          Item: {
            'PROFILE' : {S: body.profile},
            'TIMESTAMP' : {S: dateString},
            'id': {S: dateString}
          }
        };
        // Call DynamoDB to add the item to the table
        ddb.putItem(tableParams, function(err, data) {
          if (err) {
            callback(`Error logging upload ${JSON.stringify(err)}`)
          } else {
            callback(null, {
              statusCode: 200,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
              },
              body: JSON.stringify({
                message: 'Uploaded!'
              }),
            });
          }
        });
      }
    }
  );

}

module.exports.clearS3Bucket = (event, context, callback) => {
  var deletePromises = [];
  const TTL = 24 * 60 * 60 * 1000 // 24 hours 
  const now = moment(new Date())
  let clearedCount = 0;
  s3.listObjects({
    Bucket: UPLOAD_BUCKET,
    Delimiter: '/'
  }, async function (e, data) {
    if (e) {
      callback(e)
    }
    const isoPattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/
    for (let i = 0; i < data.Contents.length; i++) {
      const key = data.Contents[i].Key
      deletePromises.push(((data, key) => {
        try {
          if (key.match(isoPattern) !== null) {
            const created = moment(key.match(isoPattern)[0])
            const difference = moment.duration(now.diff(created));
            if (difference > TTL) {
              s3.deleteObject({
                Bucket: UPLOAD_BUCKET,
                Key: key
              }, function (err, data) {
                if (err) {
                } else {
                  clearedCount++
                }
              });
            }
          }
        } catch (e) {
          callback(`Error reading ${data.Contents[i].key}: ${e}`)
        }
      }).promise)
    }
    await Promise.all(deletePromises);
    callback(null, 'done')
  })
}
