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
      <div class="mb-4 position-relative"> 
        <h5>
          Información de la cita
        </h5>
        <p><strong>Código de validación:</strong> ${
          appointment.validCode
        }</p>
        <div class="position-absolute top-50 end-0 translate-middle-y">
          <img src="../../../public/images/appointment.png" alt="Appointment Icon" width="50" height="50">
        </div>
      </div>
      <div class="d-grid gap-4">
        <div>
          <h5 class="fw-light mb-3">Especialista</h5>
          <div class="card">
            <div class="card-body">
              <img src="${
                specialist.find((s) => s.id === parseInt(appointment.specialistId))
                  .image
              }" alt="Specialist Image" class="img-fluid mb-3" width="100" height="50">
              <p><strong>Nombre:</strong> ${
                specialist.find((s) => s.id === parseInt(appointment.specialistId)).name
              }</p>
              <p><strong>Especialidad:</strong> ${
                specialist.find((s) => s.id === parseInt(appointment.specialistId))
                  .specialty
              }</p>
            </div>
          </div>
        </div>
        <div>
          <h5 class="fw-light mb-3">Paciente</h5>
          <div class="card">
            <div class="card-body">
              <p><strong>Nombre:</strong> ${appointment.fullname}</p>
              <p><strong>Edad:</strong> ${appointment.patientAge || "N/A"}</p>
              <p><strong>Teléfono:</strong> ${appointment.phone}</p>
              <p><strong>Correo electrónico:</strong> ${appointment.email}</p>

              <p><button class="btn btn-link">Consular ficha del paciente</button></p>
            </div>
          </div>
        </div>
        <div>
          <h5 class="fw-light mb-3">Información de la cita</h5>
          <div class="card">
            <div class="card-body">
              <p><strong>Fecha:</strong> ${appointment.day}</p>
              <p><strong>Hora:</strong> ${appointment.time}</p>
              <p><strong>Síntomas:</strong> ${appointment.symptoms}</p>
            </div>
          </div>
        </div>
      </div>

    `;
  } else {
    appointmentInfoContainer.innerHTML = `<p>No appointment found for the provided code.</p>`;
  }
}

loadAppointmentInfo(code);
