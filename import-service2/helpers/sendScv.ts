import AWS from 'aws-sdk';

export default (record) => {
  const sqs = new AWS.SQS();

  sqs.sendMessage({
    QueueUrl: process.env.SQS_URL,
    MessageBody: JSON.stringify(record)
  }, (error, data) => {
    if (error) {
      return console.log('an SQS error occurred', error);
    }
    console.log('Data was sent', data)
  })
}
