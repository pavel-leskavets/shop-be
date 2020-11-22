import type {Serverless} from 'serverless/aws';

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
