import 'source-map-support/register';

const generatePolicy = function(event, principalId) {
  console.log(event, principalId);
  const apiOptions = {}
  const tmp = event.methodArn.split(':')
  const apiGatewayArnTmp = tmp[5].split('/')
  const awsAccountId = tmp[4]
  const awsRegion = tmp[3]
  const restApiId = apiGatewayArnTmp[0]
  const stage = apiGatewayArnTmp[1]
  const apiArn = 'arn:aws:execute-api:' + awsRegion + ':' + awsAccountId + ':' +
    restApiId + '/' + stage + '/*/*'
  const policy = {
    principalId: principalId,
    context: {
      'authStatus': true
    },
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: [apiArn]
        }
      ]
    }
  }

  console.log('Generate auth response', policy);
  return policy;
};

export const authorizerFunc = (event, context, callback) => {

  console.log(event, context);
  console.log("==================");
  console.log("Authorization: ", event.authorizationToken);
  console.log("==================", process.env.token);

  const token = event.authorizationToken;

  switch (token) {
      case 'allow':
          callback(null, generatePolicy(event, token));
          break;
      case process.env.token:
          callback(null, generatePolicy(event, token));
          break;
      case 'unauthorized':
          callback('Unauthorized');
          break;
      default:
          callback('Error');
  }
};
