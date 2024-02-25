const express = require("express");
const router = express.Router();
const { register } = require("../controller/prometheusController");

router.get("/", (req, res) => {
  console.log(register.metrics());
  res.set("Content-Type", register.contentType); // Set appropriate content type
  res.send(register.metrics());
});

module.exports = router;
