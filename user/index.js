const randomstring = require("randomstring");
const { natsWrapper } = require("@tour-app-registry/common");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./env/config.env" });
const rand = randomstring.generate(5);

//mongoose
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
console.log("DB is: ", DB);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("db connection successful");
  });

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`server started on PORT: ${PORT}`);
});

//NATS server connection
const start = async () => {
  await natsWrapper.connect(
    process.env.NATS_CLUSTER_ID,
    `${process.env.NATS_CLIENT_ID}-${rand}`,
    process.env.NATS_URL
  );
};
start();

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err);
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
