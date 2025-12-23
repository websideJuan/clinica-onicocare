import { deleteByValidCode, getByValidCode } from "../../../agenda.js";
const deletedForm = document.querySelector("#deletedForm");

deletedForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const reason = event.target.querySelector("#validCode").value;
  const date = getByValidCode(reason);



  if (!reason) {
    alert("Please provide a reason for deletion.");
    return;
  }

  if (!date) {
    alert("No appointment found with the provided valid code.");
    return;
  }

  const result = deleteByValidCode(reason);
  if (result.success) {
    alert("Appointment deleted successfully.");
  } else {
    alert(result.message);
  }

  // Here you would normally send the reason to the server
  alert("Form submitted with reason: " + reason); 
  deletedForm.reset();
});