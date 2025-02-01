const { Stack, RemovalPolicy, Duration } = require("aws-cdk-lib");
const { Certificate } = require("aws-cdk-lib/aws-certificatemanager");
const {
  Distribution,
  ViewerProtocolPolicy,
  AllowedMethods,
  CachePolicy,
} = require("aws-cdk-lib/aws-cloudfront");
const { S3BucketOrigin } = require("aws-cdk-lib/aws-cloudfront-origins");
const { Bucket } = require("aws-cdk-lib/aws-s3");
const {
  BucketDeployment,
  Source,
  CacheControl,
} = require("aws-cdk-lib/aws-s3-deployment");
const { HostedZone, CnameRecord } = require("aws-cdk-lib/aws-route53");

class InfraStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const domainName = "primetimeauto.knightj.xyz";
    const indexPage = "index.html";
    const errorPage = "error-page.html";
    const zoneName = "knightj.xyz";
    const zoneId = "Z021012427XAF7I60WUZT";

    // S3 Bucket
    const s3Bucket = new Bucket(this, "s3Bucket", {
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      websiteIndexDocument: indexPage,
      websiteErrorDocument: errorPage,
    });

    // Deploy Files to S3
    new BucketDeployment(this, "deployFilesS3Bucket", {
      destinationBucket: s3Bucket,
      sources: [Source.asset("../src")],
      cacheControl: [
        CacheControl.fromString(
          "max-age=0, no-cache, no-store, must-revalidate"
        ),
      ],
    });

    // SSL Cert for Cloudfront
    const customCert = Certificate.fromCertificateArn(
      this,
      "customCert",
      `arn:aws:acm:${this.region}:${this.account}:certificate/6fec3492-fffd-4e8d-880f-52eedd0786b1`
    );

    // Cloudfront Distribution
    const cloudFrontDist = new Distribution(this, "staticWebDistribution", {
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(s3Bucket),
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: CachePolicy.CACHING_OPTIMIZED,
      },
      defaultRootObject: indexPage,
      domainNames: [`${domainName}`],
      certificate: customCert,
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: `/${errorPage}`,
          ttl: Duration.days(10),
        },
        {
          httpStatus: 403,
          responseHttpStatus: 404,
          responsePagePath: `/${errorPage}`,
          ttl: Duration.days(10),
        },
      ],
    });

    // Route 53 - insert record
    const hostedZone = HostedZone.fromHostedZoneAttributes(this, "HostedZone", {
      hostedZoneId: zoneId,
      zoneName: zoneName,
    });

    new CnameRecord(this, "CnameApiRecord", {
      recordName: domainName,
      domainName: cloudFrontDist.distributionDomainName,
      zone: hostedZone,
    });
  }
}

module.exports = { InfraStack };
