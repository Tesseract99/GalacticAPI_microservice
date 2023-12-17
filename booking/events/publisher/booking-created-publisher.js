const nats = require("node-nats-streaming");

const {
  Publisher,
  natsWrapper,
  Subjects,
} = require("@tour-app-registry/common");

class BookingCreatedPublisher extends Publisher {
  subject = "booking:created";
}

module.exports = BookingCreatedPublisher;
