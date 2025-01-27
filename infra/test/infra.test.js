const cdk = require("aws-cdk-lib");
const { Template } = require("aws-cdk-lib/assertions");
const { InfraStack } = require("../lib/infra-stack");
const { ViewerProtocolPolicy } = require("aws-cdk-lib/aws-cloudfront");

describe("InfraStack", () => {
  let app;
  let stack;
  let template;

  beforeAll(() => {
    app = new cdk.App();
    stack = new InfraStack(app, "TestInfraStack");
    template = Template.fromStack(stack);
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
