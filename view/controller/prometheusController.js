const { register } = require("prom-client");
register.collectDefaultMetrics();
const requestCounter = new register.Counter({
  name: "my_requests_total",
  help: "Total number of requests.",
});

module.exports = requestCounter;
