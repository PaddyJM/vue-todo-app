import { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult 
} from "aws-lambda";
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  return {
    isBase64Encoded: false,
    statusCode: 200,
    body: 'wahooo',
    headers: {}
  }
}