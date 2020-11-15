import {S3Handler} from 'aws-lambda';
import 'source-map-support/register';
import AWS from 'aws-sdk';
import * as csv from 'csv-parser';

export const importFileParser: S3Handler = async (event) => {
  const s3 = new AWS.S3({region: 'eu-west-1'});

  for (const record of event.Records) {
    const s3Stream = s3.getObject({
      Bucket: 'import-bucket-task-5',
      Key: record.s3.object.key
    }).createReadStream();

    await new Promise((resolve, reject) => {
      s3Stream.pipe(csv())
        .on('data', data => {
          console.log(data)
        })
        .on('error', error => reject(error))
        .on('end', async () => {
          console.log(`Move file import-bucket-task-5/${record.s3.object.key} from uploaded folder`);

          await s3.copyObject({
            Bucket: 'import-bucket-task-5',
            CopySource: `import-bucket-task-5/${record.s3.object.key}`,
            Key: record.s3.object.key.replace('uploaded', 'parsed')
          }).promise()

          console.log(`Remove import-bucket-task-5/${record.s3.object.key} from uploaded folder`)

          await s3.deleteObject({
            Bucket: 'import-bucket-task-5',
            Key: record.s3.object.key
          }).promise()

          resolve()
        })
    })
  }
}
