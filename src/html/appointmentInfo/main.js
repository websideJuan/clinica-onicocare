import { getByValidCode, getSpecialistById } from "../../../agenda.js";
const APPOINTMENT_CODE_KEY = "appointmentCode";
const appointmentInfoContainer = document.getElementById(
  "appointmentInfoContainer"
);

function loadAppointmentInfo() {
  const code = getStoredCode();

  if (!code) {
    renderForm();
    bindCodeForm();
    return;
  }

  const appointment = getByValidCode(code);

  if (!appointment) {
    renderForm();
    bindCodeForm();
    return;
  }

  const specialist = getSpecialistById({ id: appointment.specialistId });

  renderAppointmentDetails(appointment, specialist);
  createPaymentAlert(appointment);
}

const createPaymentAlert = (appointment) => {
  if (appointment.pay === false) {
    /*
        create a modal alert at the top of the body to notify the user that their appointment is pending payment
      */

    document.body.insertAdjacentHTML(
      "afterbegin",
      `
        <div class="alert alert-warning alert-dismissible fade show m-0" role="alert">
          <strong>Atención!</strong> Tu cita está pendiente de pago. Por favor, realiza el <a href="../payment/index.html">pago</a> para confirmar tu cita.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `
    );
  }
};

const renderForm = () => {
  appointmentInfoContainer.innerHTML = `
      <div class="card">
        <div class="card-body">
          <form id="appointmentCodeForm">
            <div class="mb-3">
              <label for="appointmentCodeInput" class="form-label">Código de validación</label>
              <input type="text" class="form-control" id="appointmentCodeInput" placeholder="Ingresa tu código de validación" required>
            </div>
            <button type="submit" class="btn btn-primary">Verificar código</button>
          </form>
        </div>
      </div>
    `;
};

const bindCodeForm = () => {
  document
    .querySelector("#appointmentCodeForm")
    ?.addEventListener("submit", (e) => {
      e.preventDefault();
      const code = e.target.querySelector("input").value.trim();
      const appointment = getByValidCode(code);

      if (!appointment) return;

      
      setStoredCode(appointment.validCode);
      loadAppointmentInfo();
    });
};

const renderAppointmentDetails = (appointment, specialist) => {
  appointmentInfoContainer.innerHTML = `
      <div class="mb-4 position-relative"> 
        <h5>Información de la cita</h5>
        <p><strong>ID de validación:</strong> ${appointment.validCode}</p>
        <div class="position-absolute top-50 end-0 translate-middle-y">
          <img src="../../../public/images/Appointment.png" alt="Appointment Icon" width="50" height="50">
        </div>
      </div>
      <div class="d-grid gap-4">
        <div>
          <h5 class="fw-light mb-3">Especialista</h5>
          <div class="card">
            <div class="card-body">
              <img src="${
                specialist.image
              }" alt="Specialist Image" class="img-fluid mb-3" width="100" height="50">
              <p><strong>Nombre:</strong> ${specialist.name}</p>
              <p><strong>Especialidad:</strong> ${specialist.specialty}</p>
            </div>
          </div>
        </div>
        <div>
          <h5 class="fw-light mb-3">Paciente</h5>
          <div class="card">
            
            <div class="card-body">
              <div class="d-flex justify-content-end align-items-center mb-3">
                <div class="dropdown">
                  <button class="btn btn-light me-auto" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="../../../public/icons/options.png" alt="Options Icon" width="20" height="20">
                  </button>
                  <ul class="dropdown-menu">
                    <li class="dropdown-item"><a href="#">Descargar ficha</a></li>
                    <li class="dropdown-item"><a href="#">Enviar por correo</a></li>
                  </ul>
                </div>
              </div>
              
              <ul class="list-group list-group-flush">
                <li class="list-group-item"><strong>Nombre:</strong> ${
                  appointment.fullname
                }</li>
                <li class="list-group-item"><strong>Edad:</strong> ${
                  appointment.patientAge || "N/A"
                }</li>
                <li class="list-group-item"><strong>Teléfono:</strong> ${
                  appointment.telephone
                }</li>
                <li class="list-group-item"><strong>Correo electrónico:</strong> ${
                  appointment.email
                }</li>
              </ul>
              <button class="btn btn-link">Consular ficha</button>
            </div>
          </div>
        </div>
        <div>
          <h5 class="fw-light mb-3">Información de la cita</h5>
          <div class="card">
            <div class="card-body">
              <p><strong>Fecha:</strong> ${appointment.day}</p>
              <p><strong>Hora:</strong> ${appointment.time}</p>
              <p><strong>Síntomas:</strong> ${appointment.patientNotes}</p>
            </div>
          </div>
        </div>
      </div>
    `;
};

const renderError = () => {
  appointmentInfoContainer.innerHTML += `
    <div class="alert alert-danger mt-4" role="alert">
      Código de validación inválido. Por favor, inténtalo de nuevo.
    </div>
  `;

  setTimeout(() => {
    clearError();
  }, 5000);
};

const clearError = () => {
  const errorAlert = appointmentInfoContainer.querySelector(
    ".alert.alert-danger"
  );
  if (errorAlert) {
    errorAlert.remove();
  }
};

const getStoredCode = () => sessionStorage.getItem(APPOINTMENT_CODE_KEY);

const setStoredCode = (code) => {
  sessionStorage.setItem(APPOINTMENT_CODE_KEY, code);
};

loadAppointmentInfo();
