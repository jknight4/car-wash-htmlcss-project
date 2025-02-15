const cdk = require("aws-cdk-lib");
const { CICDStack } = require("../lib/cicd-stack");
const { AppStage } = require("../lib/app-stage");

const app = new cdk.App();

new CICDStack(app, "CICDStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

// new AppStage(app, "Prod", {
//   env: {
//     account: process.env.CDK_DEFAULT_ACCOUNT,
//     region: process.env.CDK_DEFAULT_REGION,
//   },
// });

app.synth();
