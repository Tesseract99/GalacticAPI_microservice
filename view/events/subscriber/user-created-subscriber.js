const ViewUser = require("../../models/ViewUserModel.js");
const { Subjects, Listener } = require("@tour-app-registry/common");

class UserCreatedListener extends Listener {
  queueGroupName = "view-service";
  subject = Subjects.UserCreated;
  onMessage = async (parsedData, msg) => {
    //some business logic if needed
    try {
      await ViewUser.create(parsedData);
    } catch (error) {
      console.log(`[DB ERROR]: ${error}`);
    }

    //if everything goes correctly
    msg.ack();
  };
}

module.exports = UserCreatedListener;
