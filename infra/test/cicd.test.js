const cdk = require("aws-cdk-lib");
const { Template, Match } = require("aws-cdk-lib/assertions");
const { CICDStack } = require("../lib/cicd-stack");

describe("CICDStack", () => {
  let app;
  let stack;
  let template;

  beforeAll(() => {
    app = new cdk.App();
    stack = new CICDStack(app, "TestCICDStack", {
      env: {
        account: "mock-account-id",
        region: "us-east-1",
      },
    });
    template = Template.fromStack(stack);
  });

  test("CodePipeline is created ", () => {
    template.resourceCountIs("AWS::CodePipeline::Pipeline", 1);
  });

  test("CodeConnection Source", () => {
    template.hasResourceProperties(
      "AWS::CodePipeline::Pipeline",
      Match.objectLike({
        Stages: Match.anyValue([
          Match.objectLike({
            Name: "Source",
            Provider: "CodeStarSourceConnection",
            FullRepositoryId: "jknight4/car-wash-html-css-project",
          }),
        ]),
      })
    );
  });

  test("Synth step is configured", () => {
    template.hasResourceProperties(
      "AWS::CodePipeline::Pipeline",
      Match.objectLike({
        Stages: Match.anyValue([
          Match.objectLike({
            Name: "Build",
            Provdier: "CodeBuild",
          }),
        ]),
      })
    );
  });
});
