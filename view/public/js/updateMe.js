import { showAlert } from "./alerts.js";
const updateMe = async (form, type) => {
  try {
    console.log(form);
    const { data } = await axios.patch("/api/v1/users/updateMe", form, type);

    if (data.status === "success") {
      showAlert(
        "success",
        "Personal Details Updated Successfully!.Redirecting."
      );
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
    console.log(error);
  }
};

const userDataForm = document.querySelector(".form-user-data");
userDataForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // const name = document.querySelector("#name").value;
  // const email = document.querySelector("#email").value;

  const form = new FormData();
  form.append("name", document.querySelector("#name").value);
  form.append("email", document.querySelector("#email").value);
  form.append("photo", document.querySelector("#photo").files[0]);
  updateMe(form, "data");
});
