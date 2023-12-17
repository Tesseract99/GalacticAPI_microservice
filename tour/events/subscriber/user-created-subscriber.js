const TourUser = require("../../models/userModel.js");
const { Subjects, Listener } = require("@tour-app-registry/common");

class UserCreatedListener extends Listener {
  queueGroupName = "tour-service";
  subject = Subjects.UserCreated;
  onMessage = async (parsedData, msg) => {
    //some business logic if needed
    try {
      await TourUser.create(parsedData);
    } catch (error) {
      console.log(`[DB ERROR]: ${error}`);
    }

    //if everything goes correctly
    msg.ack();
  };
}

module.exports = UserCreatedListener;
