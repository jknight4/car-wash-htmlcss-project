const { Stack, Fn } = require("aws-cdk-lib");
const { Function, Runtime, Code } = require("aws-cdk-lib/aws-lambda");
const {
  HttpLambdaIntegration,
} = require("aws-cdk-lib/aws-apigatewayv2-integrations");
const {
  HttpApi,
  HttpMethod,
  CorsHttpMethod,
} = require("aws-cdk-lib/aws-apigatewayv2");

const path = require("path");

class FormServiceStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const API_INTEGRATION = Fn.importValue("PersistenceLayerApi") + "/contacts";
    const handler = "form-lambda.handler";
    const formPath = "/form";

    // Lambda Function
    const formServiceLambda = new Function(this, "ServiceFunction", {
      runtime: Runtime.NODEJS_22_X,
      handler: handler,
      code: Code.fromAsset(path.resolve(__dirname, "../resources")),
      environment: {
        PERSISTENCE_API: API_INTEGRATION,
      },
    });

    // API GW
    const formIntegration = new HttpLambdaIntegration(
      "FormIntegration",
      formServiceLambda
    );

    const httpApi = new HttpApi(this, "FormServiceHttpApi", {
      corsPreflight: {
        allowMethods: [CorsHttpMethod.PUT, CorsHttpMethod.OPTIONS],
        allowHeaders: ["Content-Type", "Authorization"],
      },
      allowOrigins: ["https://primetimeauto.knightj.xyz"],
    });

    httpApi.addRoutes({
      path: formPath,
      methods: [HttpMethod.PUT],
      integration: formIntegration,
    });
  }
}

module.exports = { FormServiceStack };
