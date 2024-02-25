const promClient = require("prom-client");

const register = new promClient.Registry(); // Instantiate a registry
const requestCounter = new promClient.Counter({
  name: "my_requests_total",
  help: "Total number of requests.",
  registers: [register], // Register the counter
});

module.exports = { requestCounter, register };
