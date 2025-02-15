const { Stack, RemovalPolicy, CfnOutput } = require("aws-cdk-lib");
const { TableV2, AttributeType, Billing } = require("aws-cdk-lib/aws-dynamodb");
const { Function, Runtime, Code } = require("aws-cdk-lib/aws-lambda");
const { HttpApi, HttpMethod } = require("aws-cdk-lib/aws-apigatewayv2");
const {
  HttpLambdaIntegration,
} = require("aws-cdk-lib/aws-apigatewayv2-integrations");

const path = require("path");

class PersistenceStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const handler = "persistence-lambda.handler";
    const contactsPath = "/contacts";

    // Create DB
    const table = new TableV2(this, "Table", {
      partitionKey: { name: "id", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      billing: Billing.onDemand({
        maxReadRequestUnits: 10,
        maxWriteRequestUnits: 10,
      }),
    });

    // Lambda Function
    const saveLambda = new Function(this, "SaveFunction", {
      runtime: Runtime.NODEJS_22_X,
      handler: handler,
      code: Code.fromAsset(path.resolve(__dirname, "../resources")),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    table.grantReadWriteData(saveLambda);

    // API GW
    const contactIntegration = new HttpLambdaIntegration(
      "ContactIntegration",
      saveLambda
    );

    const httpApi = new HttpApi(this, "HttpApi");

    httpApi.addRoutes({
      path: contactsPath,
      methods: [HttpMethod.PUT],
      integration: contactIntegration,
    });

    new CfnOutput(this, "PersistenceLayerApi", {
      value: httpApi.apiEndpoint,
      exportName: "PersistenceLayerApi",
    });
  }
}

module.exports = { PersistenceStack };
