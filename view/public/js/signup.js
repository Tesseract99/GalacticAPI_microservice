import { showAlert } from "./alerts.js";

const signup = async ({ name, email, password, confirmPassword }) => {
  try {
    const { data } = await axios.post("/api/v1/users/signup", {
      name,
      email,
      password,
      confirmPassword,
    });
    if (data.status === "success") {
      showAlert("success", "Successfully Created Account! Redirecting...");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
    console.log(error);
  }
};

document.querySelector(".form--signup").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  signup({ name, email, password, confirmPassword });
});
