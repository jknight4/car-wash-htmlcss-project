const cdk = require("aws-cdk-lib");
const { Template } = require("aws-cdk-lib/assertions");
const { InfraStack } = require("../lib/infra-stack");
const { AppStage } = require("../lib/app-stage");
const { ViewerProtocolPolicy } = require("aws-cdk-lib/aws-cloudfront");

describe("InfraStack", () => {
  let app;
  let stack;
  let stage;
  let template;

  beforeAll(() => {
    app = new cdk.App();

    stage = new AppStage(app, "TestStage", {
      env: {
        account: "mock-account-id",
        region: "us-east-1",
      },
    });

    const stacks = stage.node.children.filter(
      (child) => child instanceof cdk.Stack
    );
    console.log(stacks);

    const infraStack = stacks.find(
      (stack) => (stack.stackName = "TestStage-InfraStack")
    );

    template = Template.fromStack(infraStack);
  });

  test("S3 Bucket is created", () => {
    template.hasResourceProperties("AWS::S3::Bucket", {
      VersioningConfiguration: {
        Status: "Enabled",
      },
    });
  });

  test("CloudFront Distribution is created", () => {
    template.hasResourceProperties("AWS::CloudFront::Distribution", {
      DistributionConfig: {
        DefaultCacheBehavior: {
          ViewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      },
    });
  });
});
