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
const {
  CloudFormationCreateUpdateStackAction,
  CodeStarConnectionsSourceAction,
} = require("aws-cdk-lib/aws-codepipeline-actions");
const { Pipeline, Artifact } = require("aws-cdk-lib/aws-codepipeline");
const { AppStage } = require("../lib/app-stage");

class CICDStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const buildArtifact = new Artifact();

    const source = CodePipelineSource.connection(
      "jknight4/car-wash-htmlcss-project",
      "aws-cdk-deployment",
      {
        connectionArn: `arn:aws:codeconnections:${this.region}:${this.account}:connection/515074e3-b7a8-4e36-a9d3-534a0d1e1370`,
        // output: buildArtifact,
      }
    );

    // const sourceAction = new CodeStarConnectionsSourceAction({
    //   actionName: "Source",
    //   owner: "jknight4",
    //   repo: "car-wash-htmlcss-project",
    //   branch: "aws-cdk-deployment",
    //   connectionArn: `arn:aws:codeconnections:${this.region}:${this.account}:connection/515074e3-b7a8-4e36-a9d3-534a0d1e1370`,
    //   output: buildArtifact,
    // });

    // const pipelineRole = new Role(this, "PipelineRole", {
    //   assumedBy: new ServicePrincipal("codebuild.amazonaws.com"),
    //   managedPolicies: [
    //     ManagedPolicy.fromAwsManagedPolicyName("AWSCodePipeline_FullAccess"),
    //   ],
    // });

    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "PrimetimeAutoPipeline",
      synth: new ShellStep("Synth", {
        input: source,
        commands: [
          "cd infra",
          "npm ci",
          "npm run test",
          "npm run build",
          "npx cdk synth Prod/InfraStack",
          // "npx cdk synth CICDStack",
        ],
        primaryOutputDirectory: "infra/cdk.out",
      }),
    });

    pipeline.addStage(new AppStage(this, "DeployStage"));
    // const lowLevelPipeline = new Pipeline(this, "LowLevelPipeline", {
    //   pipelineName: "LowLevelPipeline",
    // });

    // const deployStage = lowLevelPipeline.addStage({
    //   stageName: "Deploy",
    //   actions: [
    //     new CloudFormationCreateUpdateStackAction({
    //       actionName: "DeployStacks",
    //       stackname: "InfraStack",
    //       adminPermissions: true,
    //       templatePath: buildArtifact.atPath(
    //         "infra/cdk.out/InfraStack.template.json"
    //       ),
    //     }),
    //   ],
    // });

    // const deployStage = Pipeline.addStage({
    //   stageName: "Deploy",
    //   actions: [CloudFormationCreateUpdateStackAction],
    // });

    // pipeline.addStage("DeployLowLevelPipeline", {
    //   pre: [
    //     new ShellStep("TriggerLowLevelPipeline", {
    //       commands: [
    //         `aws codepipeline start-pipeline-execution --name ${lowLevelPipeline.pipelineName}`,
    //       ],
    //     }),
    //   ],
    // });

    // sourceAction.produceAction(deployStage);
  }
}

module.exports = { CICDStack };
