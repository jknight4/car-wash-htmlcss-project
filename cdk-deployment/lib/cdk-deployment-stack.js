const { Stack } = require("aws-cdk-lib");
const { Bucket } = require("aws-cdk-lib/aws-s3");

// const sqs = require('aws-cdk-lib/aws-sqs');

class CdkDeploymentStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const level2S3Bucket = new Bucket(this, "Level2ConstructBucket", {
      versioned: true,
    });
  }
}

module.exports = { CdkDeploymentStack };
