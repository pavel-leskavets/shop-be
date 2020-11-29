import 'source-map-support/register';

export const basicAuthorizer = async (event, context, callback) => {
  console.log("event ", JSON.stringify(event));

  if (event['type'] != 'TOKEN') {
    return callback('Unauthorized')
  }

  const generatePolicy = (principalId, resource, effect = 'Allow') => {
    return {
      principalId: principalId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource
          }
        ]
      }
    }
  }

  try {
    const authorizationToken = event.authorizationToken;

    const encodedCredentials = authorizationToken.split(' ')[1];
    const buff = Buffer.from(encodedCredentials, 'base64');
    const plainCredentials = buff.toString('utf-8').split(':');
    const [username, password] = plainCredentials;

    console.log(`username: ${username} and password: ${password}`);

    const storedUserPassword = process.env[username];
    const effect = !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';

    const policy = generatePolicy(encodedCredentials, event.methodArn, effect);

    callback(null, policy);
  } catch (e) {
    callback(`Unauthorized`)
  }

}

