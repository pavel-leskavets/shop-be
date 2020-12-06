import type {Serverless} from 'serverless/aws';

const GATEWAY_PROPERTIES = {
  Type: 'AWS::ApiGateway::GatewayResponse',
  Properties: {
    ResponseParameters: {
      'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
      'gatewayresponse.header.Access-Control-Allow-Credentials': "'true'",
      'gatewayresponse.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
      'gatewayresponse.header.Access-Control-Allow-Methods': "'GET,OPTIONS'"
    },
    ResponseType: 'ACCESS_DENIED',
    RestApiId: {
      Ref: 'ApiGatewayRestApi'
    }
  }
}

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service'
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_URL: "${cf:shop-info-service-${self:provider.stage}.SQSQueueUrl}"
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: 'arn:aws:s3:::import-bucket-task-5'
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: 'arn:aws:s3:::import-bucket-task-5/*'
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: "${cf:shop-info-service-${self:provider.stage}.SQSQueueArn}"
      }
    ]
  },
  resources: {
    Resources: {
      GatewayResponseAccessDenied: {...GATEWAY_PROPERTIES},
      GatewayResponseUnauthorized: {...GATEWAY_PROPERTIES, Properties: {...GATEWAY_PROPERTIES.Properties, ResponseType: 'UNAUTHORIZED'}}
    }
  },
  functions: {
    importProductFile: {
      handler: 'handler.importProductFile',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
            cors: {
              origins: "*"
            },
            authorizer: {
              name: 'basicAuthorizer',
              arn: "arn:aws:lambda:eu-west-1:273922851725:function:authorization-service-dev-basicAuthorizer",
              identitySource: "method.request.header.Authorization",
              type: 'token'
            },
            request: {
              parameters: {
                querystrings: {
                  name: true
                }
              }
            }
          }
        }
      ]
    },
    importFileParser: {
      handler: 'handler.importFileParser',
      events: [
        {
          s3: {
            bucket: 'import-bucket-task-5',
            event: 's3:ObjectCreated:*',
            rules: [
              {
                prefix: 'uploaded/',
                suffix: ''
              }
            ],
            existing: true
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
