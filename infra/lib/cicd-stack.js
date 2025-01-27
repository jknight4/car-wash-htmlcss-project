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

    //test
    new CodePipeline(this, "Pipeline", {
      pipelineName: "PrimetimeAutoPipeline",
      synth: new ShellStep("Sytnh", {
        input: source,
        commands: ["cd infra", "npm ci", "npm run build", "npx cdk synth"],
        primaryOutputDirectory: "infra/cdk.out",
      }),
    });
  }
}

module.exports = { CICDStack };
