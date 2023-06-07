import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult 
} from "aws-lambda";

const dynamoDBClient = new DynamoDB({
  endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566`,
  region: 'eu-west-2',
});
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const response = await dynamoDBClient.putItem({
    TableName: 'TodoApiStack-TodoTable585F1D6B-3a49e4a7',
    Item: {
      id: { S: '123' },
      name: { S: 'test' }
    }
  });
  return {
    isBase64Encoded: false,
    statusCode: 200,
    body: JSON.stringify(response),
    headers: {}
  }
}