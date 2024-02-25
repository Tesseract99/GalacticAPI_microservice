const express = require("express");
const router = express.Router();
const { register } = require("../controller/prometheusController");
console.log(await register.metrics());

router.get("/", async (req, res) => {
  try {
    const metrics = await register.metrics(); // Await and access resolved value
    res.set("Content-Type", register.contentType);
    res.send(metrics);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
