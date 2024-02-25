const promClient = require("prom-client");

console.log(promClient);
const Counter = promClient.Counter;
const requestCounter = new Counter({
  name: "my_requests_total",
  help: "Total number of requests.",
});

module.exports = requestCounter;
