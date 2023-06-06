import { CfnOutput, Stack, StackProps, aws_apigateway } from 'aws-cdk-lib';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class TodoApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambda = new NodejsFunction(this, 'createTodoHandler', {
      entry: path.join(__dirname, '../handlers/createTodoHandler.ts'),
    })

    const api = new RestApi(this, 'TodoApi', {})

    const lambdaIntegration = new aws_apigateway.LambdaIntegration(lambda)

    const resource = api.root.addResource('todo')

    resource.addMethod('GET', lambdaIntegration)

    new CfnOutput(this, "Endpoint", { value: `http://localhost:4566/restapis/${api.restApiId}/prod/_user_request_${resource.path}` })
  }
}