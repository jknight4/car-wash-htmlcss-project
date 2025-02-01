const { InfraStack } = require("./infra-stack");
const { Stage } = require("aws-cdk-lib");

class AppStage extends Stage {
  constructor(scope, id, props) {
    super(scope, id, props);

    new InfraStack(this, "InfraStack", props);
  }
}

module.exports = { AppStage };
