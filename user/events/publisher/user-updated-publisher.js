const nats = require("node-nats-streaming");

const {
  Publisher,
  natsWrapper,
  Subjects,
} = require("@tour-app-registry/common");

class UserUpdatedPublisher extends Publisher {
  subject = "user:updated";
}

module.exports = UserUpdatedPublisher;
