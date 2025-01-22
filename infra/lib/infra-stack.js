const { Stack, RemovalPolicy, Duration } = require("aws-cdk-lib");
const { Certificate } = require("aws-cdk-lib/aws-certificatemanager");
const {
  Distribution,
  ViewerProtocolPolicy,
  AllowedMethods,
} = require("aws-cdk-lib/aws-cloudfront");
const {
  S3BucketOrigin,
  S3StaticWebsiteOrigin,
} = require("aws-cdk-lib/aws-cloudfront-origins");
const { CodePipeline } = require("aws-cdk-lib/aws-events-targets");
const { Bucket } = require("aws-cdk-lib/aws-s3");
const {
  BucketDeployment,
  Source,
  CacheControl,
} = require("aws-cdk-lib/aws-s3-deployment");
const { ShellStep, CodePipelineSource } = require("aws-cdk-lib/pipelines");

class InfraStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const s3Bucket = new Bucket(this, "s3Bucket", {
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      websiteIndexDocument: "index.html",
    });

    new BucketDeployment(this, "deployFilesS3Bucket", {
      destinationBucket: s3Bucket,
      sources: [Source.asset("../src")],
      cacheControl: [
        // CacheControl.fromString("max-age=5")
        CacheControl.maxAge(Duration.days(1)),
      ],
    });

    const customCert = Certificate.fromCertificateArn(
      this,
      "customCert",
      "arn:aws:acm:us-east-1:165442463601:certificate/6fec3492-fffd-4e8d-880f-52eedd0786b1"
    );

    new Distribution(this, "staticWebDistribution", {
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(s3Bucket),
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: "index.html",
      domainNames: ["primetimeauto.knightj.xyz"],
      certificate: customCert,
    });

    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "PrimetimeAutoPipeline",
      synth: new ShellStep("Sytnh", {
        input: CodePipelineSource.gitHub(
          "jknight4/car-wash-htmlcss-project",
          "aws-cdk-deployment"
        ),
        commands: ["npx cdk synth"],
      }),
      gitHubActionRoleArn: `arn:aws:codeconnections:us-east-1:165442463601:connection/7b5bf453-74ba-433a-bf53-093715f39afd`,
    });
  }
}

module.exports = { InfraStack };
