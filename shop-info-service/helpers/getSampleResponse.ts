import { ProductModel } from "../models/product.model";

export default (body: ProductModel[] | ProductModel = null) => {
  return {
    statusCode: body ? 200 : 404,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: body ? JSON.stringify(body) : 'Product not found'
  }
}
