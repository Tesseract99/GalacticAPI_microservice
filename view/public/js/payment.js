/* eslint-disable */
import { showAlert } from "./alerts.js";

const paymentSuccessHandler = async function (response) {
  //   alert(response.razorpay_payment_id);
  //   alert(response.razorpay_order_id);
  //   alert(response.razorpay_signature);
  const { data } = await axios.post("/api/v1/bookings/payment-success", {
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_order_id: response.razorpay_order_id,
    razorpay_signature: response.razorpay_signature,
  });
  console.log(data);
  if (data.status === "success") {
    showAlert("success", " ✅  Payment Successfull. Redirecting");
    window.setTimeout(() => {
      location.assign("/my-tours");
    }, 1500);
  } else showAlert("error", "Payment Validation Failed.");
};

const bookTour = async (e, tourId) => {
  try {
    const { data } = await axios.get(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    if (data.status === "success") {
      console.log(data);

      //options
      const options = {
        key: "rzp_test_mmd8ytIiF3DOqB", // Enter the Key ID generated from the Dashboard
        amount: data.order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Galactic",
        description: "Booking Tour",
        //   image: "public/img/logo-white.png",
        order_id: data.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        // callback_url: `/api/v1/bookings/checkout-session/${tourId}`,
        callback_url: "/api/v1/tours/the-snow-adventurer",
        // redirect: true,
        handler: paymentSuccessHandler,
        theme: {
          color: "#3399cc",
        },
      };
      const rzp1 = new Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        showAlert(
          "error",
          `${response.error.description}. ${response.error.reason}`
        );
      });
      rzp1.open();
    }
  } catch (error) {
    showAlert("error", error);
  }
  e.target.textContent = "Book tour now!";
};

document.getElementById("rzp-button1").onclick = function (e) {
  e.preventDefault();
  e.target.textContent = "Processing...";
  const { tourId } = e.target.dataset;
  bookTour(e, tourId);
  e.target.textContent = "Processing...";
  //   rzp1.open();
};
