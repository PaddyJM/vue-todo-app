import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const dynamoDBClient = new DynamoDB({
  region: 'eu-west-2',
  endpoint: `${process.env.DYNAMO_DB_ENDPOINT ?? null}`
})

const tableName = process.env.TODO_TABLE_NAME || 'TodoTable-dev'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      isBase64Encoded: false,
      body: '',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
      },
      statusCode: 204
    }
  }

  if (!event.pathParameters?.clientId) {
    throw new Error('No client id provided')
  }
  const clientId = event.pathParameters.clientId

  let response
  let statusCode = 500
  try {
    if(event.httpMethod === 'PUT') {
      if (!event.body) {
        throw new Error('No body provided')
      }

      const data = JSON.parse(event.body)
      const record = marshall({
        id: clientId,
        todos: data.todos
      })
      const dynamodbPutItem = await dynamoDBClient.putItem({
        TableName: tableName,
        Item: record
      })
      statusCode = 200
      response = {
        todos: [
          dynamodbPutItem
        ]
      }
    } else if (event.httpMethod === 'GET') {
      const dynamoDBGetItem = await dynamoDBClient.getItem({
        TableName: tableName,
        Key: {
          id: {
            S: clientId
          }
        }
      })
      if(!dynamoDBGetItem.Item) {
        statusCode = 404
        response = "No item found"
      } else {
        statusCode = 200
        response = unmarshall(dynamoDBGetItem.Item)
      }
    }
  } catch (error) {
    console.log(error)
    response = error
    statusCode = 500
  }
  return {
    isBase64Encoded: false,
    body: JSON.stringify(response) ?? '',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    statusCode,
  }
}
