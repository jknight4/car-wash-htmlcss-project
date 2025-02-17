const { Stack } = require("aws-cdk-lib");
const {
  ShellStep,
  CodePipelineSource,
  CodePipeline,
} = require("aws-cdk-lib/pipelines");
const { AppStage } = require("../lib/app-stage");

class CICDStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const repoName = "jknight4/car-wash-htmlcss-project";
    const branchName = "main";
    const outputDirectory = "infra/cdk.out";

    //Connect to GitHub
    const source = CodePipelineSource.connection(repoName, branchName, {
      connectionArn: `arn:aws:codeconnections:${this.region}:${this.account}:connection/515074e3-b7a8-4e36-a9d3-534a0d1e1370`,
    });

    // CodePipeline
    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "PrimetimeAutoPipeline",
      synth: new ShellStep("Synth", {
        input: source,
        commands: [
          "cd infra",
          "npm ci",
          "npm run test",
          "npx cdk synth Prod/InfraStack",
          "npx cdk synth Prod/PersistenceStack",
          "npx cdk synth Prod/FormServiceStack",
        ],
        primaryOutputDirectory: outputDirectory,
      }),
    });

    // Deploy
    pipeline.addStage(new AppStage(this, "DeployStage", props));
  }
}

module.exports = { CICDStack };
