const { register } = require("prom-client");
const router = express.Router();

router.get("/", (_req, res) => {
  res.send(register.compileToText());
});

module.exports = router;
