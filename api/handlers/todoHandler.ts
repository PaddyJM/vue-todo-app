import { client } from '@auth0/auth0-vue/dist/typings/plugin'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { v4 as uuid } from 'uuid'

const dynamoDBClient = new DynamoDB({
  endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566`,
  region: 'eu-west-2'
})
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
  let statusCode
  try {
    if(event.httpMethod === 'PUT') {
      if (!event.body) {
        throw new Error('No body provided')
      }

      const data = JSON.parse(event.body)
      const record = marshall({
        id: clientId,
        todoList: data.todoList
      })
      const x = await dynamoDBClient.putItem({
        TableName: 'TodoTable',
        Item: record
      })
      response = {
        todoList: [
          x
        ]
      }
    } else if (event.httpMethod === 'GET') {
      const x = await dynamoDBClient.getItem({
        TableName: 'TodoTable',
        Key: {
          id: {
            S: clientId
          }
        }
      })
      if(!x.Item) {
        throw new Error('No item found')
      }
      response = unmarshall(x.Item)
    }
  statusCode = 200
  } catch (error) {
    console.log(error)
    response = error
    statusCode = 500
  }
  return {
    isBase64Encoded: false,
    body: JSON.stringify(response),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode,
  }
}
