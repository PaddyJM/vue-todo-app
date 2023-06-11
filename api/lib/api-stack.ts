import {
  CfnOutput,
  Stack,
  StackProps,
  aws_apigateway,
  aws_dynamodb,
} from 'aws-cdk-lib'
import { RestApi } from 'aws-cdk-lib/aws-apigateway'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import * as path from 'path'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class TodoApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const lambda = new NodejsFunction(this, 'createTodoHandler', {
      entry: path.join(__dirname, '../handlers/createTodoHandler.ts')
    })

    // const vpc = new aws_ec2.Vpc(this, 'myVpc', {
    //   cidr: '10.0.0.0/16',
    //   maxAzs: 2,
    //   subnetConfiguration: [
    //     {
    //       name: 'public',
    //       subnetType: aws_ec2.SubnetType.PUBLIC,
    //       cidrMask: 24
    //     }
    //   ]
    // })

    // const certificate = new aws_certificatemanager.Certificate(this, 'Certificate', {
    //   domainName: 'todo-api',
    //   validation: aws_certificatemanager.CertificateValidation.fromDns(
    //     new aws_route53.PrivateHostedZone(this, 'HostedZone', {
    //       zoneName: 'todo-api',
    //       vpc
    //     })
    //   )
    // })

    const api = new RestApi(this, 'TodoApi', {
      cloudWatchRole: false,
      // domainName: {
      //   domainName: 'todo-api',
      //   certificate
      // }
    })

    const lambdaIntegration = new aws_apigateway.LambdaIntegration(lambda, {proxy: true})

    const resource = api.root.addResource('todo')

    resource.addMethod('PUT', lambdaIntegration)

    /**
     * It turns out that when deploying to localstack by setting the default CORS 
     * options on the Rest API (above), the OPTIONS method is not implemented 
     * on the correctly corresponding API Gateway resource. This is a workaround, 
     * which is to manually add the OPTIONS method to the resource and handle 
     * that method inside the lambda in accordance with the CORS spec.
     */
    resource.addMethod('OPTIONS', lambdaIntegration)

    new aws_dynamodb.Table(this, 'TodoTable', {
      partitionKey: { name: 'id', type: aws_dynamodb.AttributeType.STRING },
      tableName: 'TodoTable'
    })

    new CfnOutput(this, 'Endpoint', {
      value: `http://localhost:4566/restapis/${api.restApiId}/prod/_user_request_${resource.path}`
    })
  }
}
