import 'source-map-support/register';
import dbOptions from "../helpers/getDbOptions";
import { Client } from 'pg';
import AWS from 'aws-sdk';


export const catalogBatchProcess = async (event) => {
  const data = event.Records.map(({body}) => JSON.parse(body));
  const client = new Client(dbOptions);
  const sns = new AWS.SNS({region: 'eu-west-1'});

  const checkFields = (record) => {
    const {title, description, price, count} = record;
    return [title, description, price, count].every(item => item !== undefined)
  }

  const sendInfoToEmail = record => {
    sns.publish({
      Subject: 'Products were created',
      Message: JSON.stringify(record),
      TopicArn: process.env.SNS_ARN
    }, () => {
      console.log('Send info', JSON.stringify(record))
    })
  }

  try {
    await client.connect()
    await Promise.all(
    data.map(async record => {
      const {title, description, price, count} = record;
      if (checkFields(record)) {
        await client.query('BEGIN');
        const {rows: [{id: insertedProductId}]} = await client.query('insert into product_list (title, description, price) values ($1, $2, $3) returning id', [title, description, price]);
        await client.query('insert into stock_list (product_id, count) values ($1, $2)', [insertedProductId, count]);
        await client.query(
          `select p.id, p.description, p.title, p.price, p.img_url as image, 
        s.count from product_list p left join stock_list s on p.id = s.product_id where p.id = $1`, [insertedProductId])
        await client.query('COMMIT');
        sendInfoToEmail(record)
      }
    }))
  } catch (e) {
    console.error('Error during database request executing', e);
    await client.query('ROLLBACK')
  } finally {
    client.end();
  }
};
