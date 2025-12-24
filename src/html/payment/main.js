import { getByValidCode, update } from "../../../agenda.js";
const codeValid = sessionStorage.getItem("appointmentCode") || "undefined";
const paymentContainer = document.getElementById("paymentContainer");

document.addEventListener("DOMContentLoaded", () => {
  if (codeValid === "undefined") {
    paymentContainer.innerHTML = `
      <div class="card">
        <div class="card-body">
          <form id="paymentCodeForm">

            <div class="mb-3">
              <label for="paymentCodeInput" class="form-label">Código de validación</label>
              <input type="text" class="form-control" id="paymentCodeInput" placeholder="Ingresa tu código de validación" required>
            </div>
            <button type="submit" class="btn btn-primary">Verificar código</button>
          </form>
        </div>
      </div>
    `;
  } else {
    loadPaymentInfo(codeValid);
  } 
});

function loadPaymentInfo(code) {
  const appointment = getByValidCode(code);
  paymentContainer.innerHTML = `
    <div class="mb-4 position-relative">
      <h5>
        Información de la cita
      </h5>
      <p><strong>Código de validación:</strong> ${appointment.validCode}</p>
      <div class="position-absolute top-50 end-0 translate-middle-y">
        <img src="../../../public/images/Appointment.png" alt="Appointment Icon" width="50" height="50">
      </div>
    </div>
    <div class="d-grid gap-4">
      <div class="card">

        <div class="card-body">
          <h5 class="card-title">Total a pagar: $50.00</h5>
          <p>Estado del pago: ${appointment.pay ? "Pagado" : "Pendiente"}</p>
          <button id="payButton" class="btn btn-success">Pagar ahora</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById("payButton").addEventListener("click", () => {
    appointment.pay = true;
    appointment.paymentDate = new Date().toISOString();
    appointment.codeTransaction = `TXN${Math.floor(Math.random() * 1000000)}`;

    const res = update(appointment.validCode, appointment);
    
    if (!res.success) {
      paymentContainer.innerHTML = `
        <div class="alert alert-danger" role="alert">
          <h4 class="alert-heading">¡Error en el pago!</h4>
          <p>Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.</p>
          <hr>
          <p class="mb-0">Si el problema persiste, contacta a soporte.</p>
        </div>
      `;
      return;
    }
    
    paymentContainer.innerHTML = `
      <div class="alert alert-success" role="alert">
        <h4 class="alert-heading">¡Pago exitoso!</h4>
        <p>Codigo ${appointment.codeTransaction}</p>
        <p>Fecha de pago: ${new Date(appointment.paymentDate).toLocaleString()}</p>
        <p>Tu pago ha sido procesado correctamente. Gracias por confiar en nosotros.</p>
        <hr>
        <p class="mb-0">Te esperamos en tu cita.</p>

        <p>Serás redirigido a la página de información de la cita.</p>
      </div>
    `;
    setTimeout(() => {
      window.location.href = "../appointmentInfo/index.html";
    }, 5000);

    
  });
}

document.querySelector("#paymentCodeForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputCode = document.getElementById("paymentCodeInput").value.trim();
  const appointment = getByValidCode(inputCode);
  sessionStorage.setItem("appointmentCode", appointment.validCode);
  loadPaymentInfo(appointment.validCode);
});