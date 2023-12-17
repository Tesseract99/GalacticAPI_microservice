import { showAlert } from "./alerts.js";
const updatePassword = async ({
  currentPassword,
  newPassword,
  newConfirmPassword,
}) => {
  try {
    const { data } = await axios.patch("/api/v1/users/updatePassword", {
      currentPassword,
      newPassword,
      newConfirmPassword,
    });

    if (data.status === "success") {
      showAlert("success", "Password Updated Successfully! Redirecting.");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
    // console.log(data);
  } catch (error) {
    showAlert("error", error.response.data.message);
    console.log(error);
  }
};

document.querySelector(".btn--save-password").addEventListener("click", (e) => {
  e.preventDefault();
  const currentPassword = document.querySelector("#password-current").value;
  const newPassword = document.querySelector("#password").value;
  const newConfirmPassword = document.querySelector("#password-confirm").value;
  updatePassword({ currentPassword, newPassword, newConfirmPassword });
});
