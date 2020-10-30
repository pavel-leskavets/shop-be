import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import productList from '../data/shop-data.json';
import getSampleResponse from '../helpers/getSampleResponse';

export const getProducts: APIGatewayProxyHandler = async () => {
  try {
    return getSampleResponse(productList);
  } catch (e) {
    return getSampleResponse()
  }
};
