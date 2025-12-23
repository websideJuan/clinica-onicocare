import { getByValidCode, get } from "../../../agenda.js";
const getCode = localStorage.getItem("appointmentCode");
const specialist = get({ database: "specialist" });
const code = getCode ? JSON.parse(getCode) : null;
const appointmentInfoContainer = document.getElementById(
  "appointmentInfoContainer"
);

function loadAppointmentInfo(code) {
  const appointment = getByValidCode(code);

  if (appointment) {
    appointmentInfoContainer.innerHTML = `  
      <div class="card">
        <div class="card-header">
          <h5 class="card-title">Appointment Information</h5>
          <span class="text-muted">Appointment Valid Code: ${appointment.validCode}</span>
        </div>
        <div class="card-body">
        
          <p><strong>Date:</strong> ${appointment.day}</p>
          <p><strong>Time:</strong> ${appointment.time}</p>
          <p><strong>Location:</strong> ${appointment.location}</p>
          <p><strong>Description:</strong> ${appointment.description}</p>

          <p><strong>Specialty:</strong> ${appointment.service}</p>
          <p><strong>Specialist ID:</strong> ${specialist.find(s => s.id === parseInt(appointment.specialistId))?.name || "Unknown"}</p>


          <div class="d-flex justify-content-between">
            <button id="editButton" class="btn btn-success mt-4">
              Edit 
            </button>

            <button id="cancelButton" class="btn btn-danger mt-4">
              Cancel 
            </button>
          </div>
        </div>
      </div>

    `;
  } else {
    appointmentInfoContainer.innerHTML = `<p>No appointment found for the provided code.</p>`;
  }
}

loadAppointmentInfo(code);
