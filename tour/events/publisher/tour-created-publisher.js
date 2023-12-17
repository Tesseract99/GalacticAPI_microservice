const nats = require("node-nats-streaming");
const randomstring = require("randomstring");

const {
  Publisher,
  natsWrapper,
  Subjects,
} = require("@tour-app-registry/common");

class TourCreatedPublisher extends Publisher {
  subject = "tour:created";
}

module.exports = TourCreatedPublisher;
