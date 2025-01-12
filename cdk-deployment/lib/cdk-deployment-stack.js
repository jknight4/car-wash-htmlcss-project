const { Stack, RemovalPolicy } = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
const { BucketDeployment, Source } = require("aws-cdk-lib/aws-s3-deployment");
// const { Asset } = require("aws-cdk-lib/aws-s3-assets");

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

    const level2S3Bucket = new s3.Bucket(this, "Level2ConstructBucket", {
      versioned: true,
      bucketName: "primetime-new-bucket-test",
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // new BucketDeployment(this, "DeployFIles", {
    //   sources: [Source.asset("../assets")],
    //   destinationBucket: level2S3Bucket,
    // });

    new BucketDeployment(this, "DeployFiles", {
      sources: [Source.asset("../assets")],
      destinationBucket: level2S3Bucket,
    });

    // const fileAsset = new Asset(this, "TestAsset1", {
    //   path: "../assets",
    // });
  }
}

module.exports = { CdkDeploymentStack };
