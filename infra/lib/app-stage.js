const { FormServiceStack } = require("./form-service-stack");
const { InfraStack } = require("./infra-stack");
const { PersistenceStack } = require("./persistence-stack");
const { Stage } = require("aws-cdk-lib");

class AppStage extends Stage {
  constructor(scope, id, props) {
    super(scope, id, props);

    new InfraStack(this, "InfraStack", props);
    new PersistenceStack(this, "PersistenceStack", props);
    new FormServiceStack(this, "FormServiceStack", props);
  }
}

module.exports = { AppStage };
