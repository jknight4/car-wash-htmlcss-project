const { App, Stack } = require("aws-cdk-lib");
const { Template } = require("aws-cdk-lib/assertions");
const { FormServiceStack } = require("../lib/form-service-stack");

describe("FormServiceStack", () => {
  let app, stack, template;

  beforeEach(() => {
    app = new App();
    stack = new FormServiceStack(app, "TestFormServiceStack");
    template = Template.fromStack(stack);
  });

  test("Lambda function is created", () => {
    template.resourceCountIs("AWS::Lambda::Function", 1);
    template.hasResourceProperties("AWS::Lambda::Function", {
      Runtime: "nodejs22.x",
      Handler: "form-lambda.handler",
    });
  });

  test("API Gateway is created with correct settings", () => {
    template.resourceCountIs("AWS::ApiGatewayV2::Api", 1);
    template.hasResourceProperties("AWS::ApiGatewayV2::Api", {
      CorsConfiguration: {
        AllowMethods: ["PUT", "OPTIONS"],
        AllowHeaders: ["Content-Type", "Authorization"],
        AllowOrigins: ["https://primetimeauto.knightj.xyz"],
      },
    });
  });

  test("Custom domain is configured", () => {
    template.hasResourceProperties("AWS::ApiGatewayV2::DomainName", {
      DomainName: "primetimeautoform.knightj.xyz",
    });
  });

  test("Route 53 A record is created", () => {
    template.resourceCountIs("AWS::Route53::RecordSet", 1);
    template.hasResourceProperties("AWS::Route53::RecordSet", {
      Name: "primetimeautoform.knightj.xyz.",
      Type: "A",
    });
  });
});
