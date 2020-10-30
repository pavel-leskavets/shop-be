import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import productList from '../data/shop-data.json';
import getSampleResponse from '../helpers/getSampleResponse';
import { ProductModel } from '../models/product.model';

export const getProductsById: APIGatewayProxyHandler = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const selectedProduct: ProductModel = productList.find(item => item.id === productId);
    return getSampleResponse(selectedProduct);
  } catch (e) {
    return getSampleResponse();
  }
}
