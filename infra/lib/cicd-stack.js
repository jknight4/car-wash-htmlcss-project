const { Stack } = require("aws-cdk-lib");
const {
  ShellStep,
  CodePipelineSource,
  CodePipeline,
} = require("aws-cdk-lib/pipelines");

class CICDStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const source = CodePipelineSource.connection(
      "jknight4/car-wash-htmlcss-project",
      "aws-cdk-deployment",
      {
        connectionArn: `arn:aws:codeconnections:${this.region}:${this.account}:connection/515074e3-b7a8-4e36-a9d3-534a0d1e1370`,
      }
    );

    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "PrimetimeAutoPipeline",
      synth: new ShellStep("Sytnh", {
        input: source,
        commands: [
          "cd infra",
          "npm ci",
          "npm run test",
          "npm run build",
          "npx cdk synth InfraStack",
          "npx cdk synth CICDStack",
          "npm deploy InfraStack",
        ],
        primaryOutputDirectory: "infra/cdk.out",
      }),
    });

    pipeline.addStage({});
  }
}

module.exports = { CICDStack };
