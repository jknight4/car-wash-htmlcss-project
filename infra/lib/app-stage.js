const { FormServiceStack } = require("./form-service-stack");
const { InfraStack } = require("./infra-stack");
const { PersistenceStack } = require("./persistence-stack");
const { Stage } = require("aws-cdk-lib");

class AppStage extends Stage {
  constructor(scope, id, props) {
    super(scope, id, props);

    const infraStack = new InfraStack(this, "InfraStack", props);
    const persistenceStack = new PersistenceStack(
      this,
      "PersistenceStack",
      props
    );
    const formStack = new FormServiceStack(this, "FormServiceStack", props);

    formStack.addDependency(persistenceStack);
    formStack.addDependency(infraStack);
  }
}

module.exports = { AppStage };
