const { Stack, Fn } = require("aws-cdk-lib");
const { Function, Runtime, Code } = require("aws-cdk-lib/aws-lambda");
const {
  HttpLambdaIntegration,
} = require("aws-cdk-lib/aws-apigatewayv2-integrations");
const {
  HttpApi,
  HttpMethod,
  CorsHttpMethod,
  DomainName,
} = require("aws-cdk-lib/aws-apigatewayv2");
const { Certificate } = require("aws-cdk-lib/aws-certificatemanager");
const {
  HostedZone,
  RecordTarget,
  ARecord,
} = require("aws-cdk-lib/aws-route53");
const {
  ApiGatewayv2DomainProperties,
} = require("aws-cdk-lib/aws-route53-targets");

const path = require("path");

class FormServiceStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const API_INTEGRATION = Fn.importValue("PersistenceLayerApi") + "/contacts";
    const handler = "form-lambda.handler";
    const formPath = "/form";
    const domainName = "primetimeautoform.knightj.xyz";
    const origin = "https://primetimeauto.knightj.xyz";
    const zoneName = "knightj.xyz";
    const zoneId = "Z021012427XAF7I60WUZT";

    // Lambda Function
    const formServiceLambda = new Function(this, "ServiceFunction", {
      runtime: Runtime.NODEJS_22_X,
      handler: handler,
      code: Code.fromAsset(path.resolve(__dirname, "../resources")),
      environment: {
        PERSISTENCE_API: API_INTEGRATION,
      },
    });

    //Cert for custom Domain
    const customCert = Certificate.fromCertificateArn(
      this,
      "customCert",
      `arn:aws:acm:${this.region}:${this.account}:certificate/6fec3492-fffd-4e8d-880f-52eedd0786b1`
    );

    // API GW
    const formIntegration = new HttpLambdaIntegration(
      "FormIntegration",
      formServiceLambda
    );

    const fullDomainName = new DomainName(this, "DomainNameFormService", {
      domainName: domainName,
      certificate: customCert,
    });

    const httpApi = new HttpApi(this, "FormServiceHttpApi", {
      corsPreflight: {
        allowMethods: [CorsHttpMethod.PUT, CorsHttpMethod.OPTIONS],
        allowHeaders: ["Content-Type", "Authorization"],
        allowOrigins: [origin],
      },
      defaultDomainMapping: {
        domainName: fullDomainName,
      },
      disableExecuteApiEndpoint: true,
    });

    httpApi.addRoutes({
      path: formPath,
      methods: [HttpMethod.PUT],
      integration: formIntegration,
    });

    // Route 53 - insert record
    const hostedZone = HostedZone.fromHostedZoneAttributes(
      this,
      "HostedZoneDuplicate",
      {
        hostedZoneId: zoneId,
        zoneName: zoneName,
      }
    );

    new ARecord(this, "ARecordAPIGW", {
      recordName: domainName,
      zone: hostedZone,
      target: RecordTarget.fromAlias(
        new ApiGatewayv2DomainProperties(
          fullDomainName.regionalDomainName,
          fullDomainName.regionalHostedZoneId
        )
      ),
    });
  }
}

module.exports = { FormServiceStack };
