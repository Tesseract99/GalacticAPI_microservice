const { register } = require("prom-client");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send(register.metrics());
});

module.exports = router;
