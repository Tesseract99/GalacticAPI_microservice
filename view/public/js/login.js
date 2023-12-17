import { showAlert } from "./alerts.js";

const login = async ({ email, password }) => {
  try {
    const { data } = await axios.post("/api/v1/users/login", {
      email,
      password,
    });
    if (data.status === "success") {
      showAlert("success", "Logged in successfully!. Redirecting.");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
    console.log(error);
  }
};

document.querySelector(".form--login").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  login({ email, password });
});
