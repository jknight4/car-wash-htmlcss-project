const { InfraStack } = require("./infra-stack");
const { Stage } = require("aws-cdk-lib");

class AppStage extends Stage {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    new InfraStack(this, "InfraStack");
  }
}

module.exports = { AppStage };
