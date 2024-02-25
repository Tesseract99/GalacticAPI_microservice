const promClient = require("prom-client");

// console.log(promClient);
const counter = new promClient.Counter();
const register = new promClient.Registry(); // Instantiate a registry

const requestCounter = counter({
  name: "my_requests_total",
  help: "Total number of requests.",
  registers: [register], // Register the counter
});

module.exports = { requestCounter, register };
