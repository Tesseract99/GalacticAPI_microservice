const nats = require("node-nats-streaming");

const {
  Publisher,
  natsWrapper,
  Subjects,
} = require("@tour-app-registry/common");

class UserCreatedPublisher extends Publisher {
  subject = Subjects.UserCreated;
}

module.exports = UserCreatedPublisher;
