import { ProductModel } from "../models/product.model";

export default (body: ProductModel[] | ProductModel = null) => {
  return {
    statusCode: body ? 200 : 404,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(body ? body : 'Product not found')
  }
}
