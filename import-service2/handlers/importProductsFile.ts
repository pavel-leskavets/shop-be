import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import AWS from 'aws-sdk';

export const importProductFile: APIGatewayProxyHandler = async (event, _context) => {
  const { name } = event.queryStringParameters;
  const catalogPath = `uploaded/${name}`;

  const s3 = new AWS.S3({region: 'eu-west-1', signatureVersion: "v4" });
  const params = {
    Bucket: 'import-bucket-task-5',
    Key: catalogPath,
    Expires: 60,
    ContentType: 'text/csv'
  };

  return await new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', params, (error, url) => {
      if (error) {
        return reject(error)
      }

      resolve({
        statusCode: 200,
        headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': true},
        body: url
      })
    })
  })
}
