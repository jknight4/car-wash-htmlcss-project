#!/usr/bin/env node

const cdk = require("aws-cdk-lib");
const { CdkDeploymentStack } = require("../lib/cdk-deployment-stack");

const app = new cdk.App();
new CdkDeploymentStack(app, "CdkDeploymentStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
