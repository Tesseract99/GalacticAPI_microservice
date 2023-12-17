import { showAlert } from "./alerts.js";
// import axios from "https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js";

const logout = async function (e) {
  console.log("clicked");
  try {
    const { data } = await axios.get("/api/v1/users/logout");
    if (data.status === "success") {
      showAlert("success", "Logged Out Successfully. Redirecting.");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
      // location.reload(true);
    }
  } catch (error) {
    showAlert("error", error);
  }
};

document
  .getElementsByClassName("nav__el--logout")[0]
  .addEventListener("click", logout);
