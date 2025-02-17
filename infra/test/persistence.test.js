const { App, Stack } = require("aws-cdk-lib");
const { Template } = require("aws-cdk-lib/assertions");
const { PersistenceStack } = require("../lib/persistence-stack");

describe("PersistenceStack", () => {
  let app, stack, template;

  beforeEach(() => {
    app = new App();
    stack = new PersistenceStack(app, "TestPersistenceStack");
    template = Template.fromStack(stack);
  });

  test("DynamoDB Table is created", () => {
    template.resourceCountIs("AWS::DynamoDB::GlobalTable", 1);
    template.hasResourceProperties("AWS::DynamoDB::GlobalTable", {
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      BillingMode: "PAY_PER_REQUEST",
    });
  });

  test("Lambda function is created with correct properties", () => {
    template.resourceCountIs("AWS::Lambda::Function", 1);
    template.hasResourceProperties("AWS::Lambda::Function", {
      Runtime: "nodejs22.x",
      Handler: "persistence-lambda.handler",
    });
  });

  test("API Gateway is created and integrated with Lambda", () => {
    template.resourceCountIs("AWS::ApiGatewayV2::Api", 1);
    template.hasResourceProperties("AWS::ApiGatewayV2::Api", {});
  });

  test("API Gateway has correct route", () => {
    template.hasResourceProperties("AWS::ApiGatewayV2::Route", {
      RouteKey: "PUT /contacts",
    });
  });

  test("Outputs API endpoint", () => {
    template.hasOutput("PersistenceLayerApi", {
      Export: { Name: "PersistenceLayerApi" },
    });
  });
});
