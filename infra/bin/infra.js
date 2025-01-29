#!/usr/bin/env node

const cdk = require("aws-cdk-lib");
const { InfraStack } = require("../lib/infra-stack");
const { CICDStack } = require("../lib/cicd-stack");
const { AppStage } = require("../lib/app-stage");

const app = new cdk.App();
// new InfraStack(app, "InfraStack", {
//   env: {
//     account: process.env.CDK_DEFAULT_ACCOUNT,
//     region: process.env.CDK_DEFAULT_REGION,
//   },
// });

new CICDStack(app, "CICDStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

new AppStage(app, "Prod", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

app.synth();
