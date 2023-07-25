import {
  RemovalPolicy,
  Stack,
  StackProps,
  aws_apigateway,
  aws_dynamodb,
  aws_s3_deployment,
} from 'aws-cdk-lib'
import { RestApi } from 'aws-cdk-lib/aws-apigateway'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import * as aws_s3 from 'aws-cdk-lib/aws-s3'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'
import * as path from 'path'

const env = process.env.DEPLOYMENT_ENV || 'dev'

export class TodoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    /**
     * Comment this out if creating a new table
     */
    const table = aws_dynamodb.Table.fromTableArn(this, `TodoTable-${env}`, `arn:aws:dynamodb:eu-west-2:011624951925:table/TodoTable-${env}`);

    /**
     * Uncomment this to create new table if necessary
     */
    // const table = new aws_dynamodb.Table(this, `TodoTable-${env}`, {
    //   partitionKey: { name: 'id', type: aws_dynamodb.AttributeType.STRING },
    //   tableName: `TodoTable-${env}`,
    //   removalPolicy: RemovalPolicy.RETAIN,
    // })


    const lambda = new NodejsFunction(this, `todoHandler-${env}`, {
      entry: path.join(__dirname, './handlers/todoHandler.ts'),
      environment: {
        TODO_TABLE_NAME: table.tableName
      }
    })

    lambda.addToRolePolicy(new iam.PolicyStatement({
        actions: ['dynamodb:*'],
        resources: [table.tableArn]
      })
    );

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
    //   domainName: 'todo',
    //   validation: aws_certificatemanager.CertificateValidation.fromDns(
    //     new aws_route53.PrivateHostedZone(this, 'HostedZone', {
    //       zoneName: 'todo',
    //       vpc
    //     })
    //   )
    // })

    const api = new RestApi(this, `TodoApi-${env}`, {
      cloudWatchRole: false,
      
      // domainName: {
      //   domainName: 'todo-api',
      //   certificate
      // }
    })

    const lambdaIntegration = new aws_apigateway.LambdaIntegration(lambda, {proxy: true})

    const clientResource = api.root.addResource('client')
    const clientResourceId = clientResource.addResource('{clientId}')
    const todoResource = clientResourceId.addResource('todo')

    todoResource.addMethod('PUT', lambdaIntegration)

    todoResource.addMethod('GET', lambdaIntegration)

    /**
     * It turns out that when deploying to localstack by setting the default CORS 
     * options on the Rest API (above), the OPTIONS method is not implemented 
     * on the correctly corresponding API Gateway resource. This is a workaround, 
     * which is to manually add the OPTIONS method to the resource and handle 
     * that method inside the lambda in accordance with the CORS spec.
     */
    todoResource.addMethod('OPTIONS', lambdaIntegration)

    const bucket = new aws_s3.Bucket(this, `TodoBucket-${env}`, {
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
      blockPublicAccess: aws_s3.BlockPublicAccess.BLOCK_ACLS,
      accessControl: aws_s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
    })

    new aws_s3_deployment.BucketDeployment(this, `DeployTodoWebsite-${env}`, {
      sources: [aws_s3_deployment.Source.asset(path.join(__dirname, '../dist'))],
      destinationBucket: bucket
    })
  }
}
