const randomstring = require("randomstring");
const { natsWrapper } = require("@tour-app-registry/common");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
const TourCreatedListener = require("./events/subscriber/tour-created-subscriber");
const UserCreatedListener = require("./events/subscriber/user-created-subscriber");
const BookingCreatedListener = require("./events/subscriber/booking-created-subscriber");
const UserUpdatedListener = require("./events/subscriber/user-updated-subscriber");
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
  const stan = natsWrapper.client;
  new TourCreatedListener(stan).listen();
  new UserCreatedListener(stan).listen();
  new BookingCreatedListener(stan).listen();
  new UserUpdatedListener(stan).listen();
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
