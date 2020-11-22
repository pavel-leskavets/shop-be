import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';

import getSampleResponse from '../helpers/getSampleResponse';
import getErrorResponse from "../helpers/getErrorResponse";
import dbOptions from "../helpers/getDbOptions";


export const createProduct: APIGatewayProxyHandler = async (event) => {
  const client = new Client(dbOptions);
  console.log(`event ${JSON.stringify(event)}`, `body ${JSON.stringify(event.body)}`);

  try {
    const {title, description, price, count} = JSON.parse(event.body);
    await client.connect();

    await client.query('BEGIN');
    const {rows: [{id: insertedProductId}]} = await client.query('insert into product_list (title, description, price) values ($1, $2, $3) returning id', [title, description, price]);
    await client.query('insert into stock_list (product_id, count) values ($1, $2)', [insertedProductId, count]);
    const {rows: products} = await client.query(
      'select p.id, p.description, p.title, p.price, p.img_url as image, ' +
      's.count from product_list p left join stock_list s on p.id = s.product_id where p.id = $1', [insertedProductId])
    await client.query('COMMIT');
    return getSampleResponse(products)
  } catch (e) {
    console.error('Error during database request executing', e);
    await client.query('ROLLBACK')
    return getErrorResponse()
  } finally {
    client.end();
  }
};
