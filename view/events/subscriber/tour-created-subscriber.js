const { Subjects, Listener } = require("@tour-app-registry/common");
const ViewTour = require("../../models/ViewTourModel");
class TourCreatedListener extends Listener {
  queueGroupName = "view-service";
  subject = "tour:created";
  onMessage = async (parsedData, msg) => {
    //some business logic if needed
    try {
      await ViewTour.create(parsedData);
    } catch (error) {
      console.log(`[DB ERROR]: ${error}`);
    }

    //if everything goes correctly
    msg.ack();
  };
}

module.exports = TourCreatedListener;
