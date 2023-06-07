import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
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
  if (!event.body) {
    throw new Error('No body provided');
  }
  const data = JSON.parse(event.body);
  const record = marshall({
    list: data.todos,
    id: "1",
  });
  let response;
  let statusCode;
  try {
    response = await dynamoDBClient.putItem({
      TableName: 'TodoTable',
      Item: record,
    });
    statusCode = 200;
  } catch (error) {
    console.log(error);
    response = error;
    statusCode = 500;
  }
  return {
    isBase64Encoded: false,
    statusCode,
    body: JSON.stringify(response),
    headers: {}
  }
}