const ViewBooking = require("../../models/ViewBookingModel");
const { Subjects, Listener } = require("@tour-app-registry/common");

class BookingCreatedListener extends Listener {
  queueGroupName = "view-service";
  subject = "booking:created";
  onMessage = async (parsedData, msg) => {
    //some business logic if needed
    try {
      await ViewBooking.create(parsedData);
    } catch (error) {
      console.log(`[DB ERROR]: ${error}`);
    }

    //if everything goes correctly
    msg.ack();
  };
}

module.exports = BookingCreatedListener;
