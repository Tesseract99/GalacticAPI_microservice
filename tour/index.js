const UserCreatedListener = require("./events/subscriber/user-created-subscriber.js");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
const randomstring = require("randomstring");
const { natsWrapper } = require("@tour-app-registry/common");

dotenv.config({ path: "./env/config.env" });
const rand = randomstring.generate(5);
//mongoose
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log("db connection successful");
  });

// console.log(process.env.NODE_ENV)
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
  const stan = natsWrapper.client;
  new UserCreatedListener(stan).listen();
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
