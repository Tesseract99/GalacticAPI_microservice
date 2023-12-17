const ViewUser = require("../../models/ViewUserModel.js");
const { Subjects, Listener } = require("@tour-app-registry/common");

class UserUpdatedListener extends Listener {
  queueGroupName = "view-service";
  subject = "user:updated";
  onMessage = async (parsedData, msg) => {
    //some business logic if needed
    try {
      const filter = { email: parsedData.origEmail };

      await ViewUser.findOneAndUpdate(filter, parsedData);
    } catch (error) {
      console.log(`[DB ERROR]: ${error}`);
    }

    //if everything goes correctly
    msg.ack();
  };
}

module.exports = UserUpdatedListener;
