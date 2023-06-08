import {
  CfnOutput,
  Stack,
  StackProps,
  aws_apigateway,
  aws_certificatemanager,
  aws_dynamodb,
  aws_ec2,
  aws_route53
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

    const lambdaIntegration = new aws_apigateway.LambdaIntegration(lambda)

    const resource = api.root.addResource('todo')

    resource.addMethod('GET', lambdaIntegration)

    new aws_dynamodb.Table(this, 'TodoTable', {
      partitionKey: { name: 'id', type: aws_dynamodb.AttributeType.STRING },
      tableName: 'TodoTable'
    })

    new CfnOutput(this, 'Endpoint', {
      value: `http://localhost:4566/restapis/${api.restApiId}/prod/_user_request_${resource.path}`
    })
  }
}
