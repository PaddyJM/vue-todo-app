import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { v4 as uuid } from 'uuid'

const dynamoDBClient = new DynamoDB({
  endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566`,
  region: 'eu-west-2'
})
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      body: '',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
      },
      statusCode: 204
    }
  }
  if (!event.body) {
    throw new Error('No body provided')
  }

  const data = JSON.parse(event.body)
  const record = marshall({
    id: '1',
    todos: data.todos
  })
  let response
  let statusCode
  try {
    response = await dynamoDBClient.putItem({
      TableName: 'TodoTable',
      Item: record
    })
    statusCode = 200
  } catch (error) {
    console.log(error)
    response = error
    statusCode = 500
  }
  return {
    body: JSON.stringify(response),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode,
  }
}
