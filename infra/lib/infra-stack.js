const { Stack, RemovalPolicy, Duration } = require("aws-cdk-lib");
const { Certificate } = require("aws-cdk-lib/aws-certificatemanager");
const {
  Distribution,
  ViewerProtocolPolicy,
  AllowedMethods,
} = require("aws-cdk-lib/aws-cloudfront");
const { S3BucketOrigin } = require("aws-cdk-lib/aws-cloudfront-origins");
const { Bucket } = require("aws-cdk-lib/aws-s3");
const {
  BucketDeployment,
  Source,
  CacheControl,
} = require("aws-cdk-lib/aws-s3-deployment");

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
      websiteErrorDocument: "error-page.html",
    });

    new BucketDeployment(this, "deployFilesS3Bucket", {
      destinationBucket: s3Bucket,
      sources: [Source.asset("../src")],
      cacheControl: [
        CacheControl.fromString("max-age=0, no-cache, no-store"),
        // CacheControl.maxAge(Duration.days(1)),
      ],
    });

    const customCert = Certificate.fromCertificateArn(
      this,
      "customCert",
      `arn:aws:acm:${this.region}:${this.account}:certificate/6fec3492-fffd-4e8d-880f-52eedd0786b1`
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
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: "/error-page.html",
          ttl: Duration.days(10),
        },
        {
          httpStatus: 403,
          responseHttpStatus: 404,
          responsePagePath: "/error-page.html",
          ttl: Duration.days(10),
        },
      ],
    });
  }
}

module.exports = { InfraStack };
