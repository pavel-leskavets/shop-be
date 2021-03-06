import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';

import getSampleResponse from '../helpers/getSampleResponse';
import getErrorResponse from "../helpers/getErrorResponse";
import dbOptions from "../helpers/getDbOptions";


export const getProducts: APIGatewayProxyHandler = async (event) => {
  const client = new Client(dbOptions);
  console.log(`event ${JSON.stringify(event)}`);

  try {
    await client.connect();
    const {rows: products} = await client.query('select p.id, p.description, p.title, p.price, p.img_url as image, s.count from product_list p left join stock_list s on p.id = s.product_id');
    return getSampleResponse(products.length ? products : null)
  } catch (e) {
    console.error('Error during database request executing', e);
    return getErrorResponse();
  } finally {
    client.end();
  }
};
