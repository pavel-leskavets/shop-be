import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';

import getSampleResponse from '../helpers/getSampleResponse';
import getErrorResponse from "../helpers/getErrorResponse";
import dbOptions from "../helpers/getDbOptions";


export const createProduct: APIGatewayProxyHandler = async (event) => {
  const {title, description, price, count} = JSON.parse(event.body);
  const client = new Client(dbOptions);
  await client.connect();
  console.log(`event ${JSON.stringify(event)}`, `body ${JSON.stringify(event.body)}`);

  try {
    const {rows: products} = await client.query('with insert_in_products as (insert into product_list ' +
      '(title, description, price) values ($1, $2, $3) returning *), ' +
      'insert_in_stock as (insert into stock_list (product_id, count) ' +
      'values ((select id from insert_in_products), $4) returning count, product_id) ' +
      'select insert_in_products.id, insert_in_products.title, insert_in_products.description, ' +
      'insert_in_products.price, insert_in_stock.count from insert_in_products ' +
      'left join insert_in_stock on insert_in_products.id = insert_in_stock.product_id', [title, description, price, count]).then(res => res);
    return getSampleResponse(products)
  } catch (e) {
    console.error('Error during database request executing', e);
    return getErrorResponse()
  } finally {
    client.end();
  }
};
