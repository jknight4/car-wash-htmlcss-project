const { Stack } = require("aws-cdk-lib");
const {
  ServicePrincipal,
  Role,
  ManagedPolicy,
} = require("aws-cdk-lib/aws-iam");
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

    const pipelineRole = new Role(this, "PipelineRole", {
      assumedBy: new ServicePrincipal("codepipeline.amazonaws.com"),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName("AWSCodePipeline_FullAccess"),
      ],
    });

    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "PrimetimeAutoPipeline",
      synth: new ShellStep("Synth", {
        input: source,
        commands: [
          "npm install -g aws-cdk",
          "cd infra",
          "npm ci",
          "npm run test",
          "npm run build",
          "npx cdk bootstrap",
          "npx cdk synth InfraStack",
          "npx cdk synth CICDStack",
          "npx cdk deploy --all",
        ],
        primaryOutputDirectory: "infra/cdk.out",
      }),
      role: pipelineRole,
    });
  }
}

module.exports = { CICDStack };
