import { get, schedule } from "../../../agenda.js";
const especialytiesForm = document.querySelector("#especialytiesForm");
const programDateForm = document.querySelector("#programDateForm");
const specialityEdit = document.querySelector("#specialityEdit");
const inputsCollection = document.querySelectorAll("[data-control='infoCite']");
const listSpecialists = document.querySelector("#listSpecialists");
const programDateContainer = document.querySelector("#programDateContainer");
const selectedSpecialtyDisplay = document.querySelector("#selectedSpecialtyDisplay");
const assignedSpecialistDisplay = document.querySelector("#assignedSpecialistDisplay");
const storedSpecialty =
  JSON.parse(localStorage.getItem("selectedSpecialty")) || {};

document.addEventListener("DOMContentLoaded", () => {
  programDateForm.classList.add("d-none");

  if (storedSpecialty.hasOwnProperty("specialty")) {
    especialytiesForm.classList.add("d-none");
    programDateForm.classList.remove("d-none");
    specialityEdit.style.transform = "translate(-50%, 0)";
  }
});

inputsCollection.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.name === "specialty") {
      const specialists = get({
        database: "specialties",
        specialty: input.value,
      });

      listSpecialists.innerHTML = "";
      specialists.forEach((specialist, i) => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item";
        listItem.innerHTML = `<input class="form-check-input" type="radio" name="specialistOptions" id="specialist${i}" value="${
          specialist.id
        }" data-control="infoCite" required/>
                  <label
                    class="form-check-label d-flex align-items-center"
                    for="specialist${i}"
                  >
                    ${specialist.name} - ${specialist.specialty.join(", ")}
                    <img
                      src="${
                        specialist.image || "https://via.placeholder.com/70"
                      }"
                      class="rounded-circle d-block ms-3 object-fit-cover"
                      width="70"
                      height="70"
                      alt=""
                    />
                  </label>`;

        listSpecialists.appendChild(listItem);
      });
    }

    if (input.name === "date") {
      const getTimeDisponibility = async () => {
        const specialists = get({ database: "specialist" });
        
        const dateValue = input.value;

        if (dateValue < new Date().toISOString().split("T")[0]) {
          alert("Please select a valid date.");
          input.value = "";
          return;
        }
        
        const specialist = specialists.find(
          (specialist) => specialist.id === parseInt(storedSpecialty.specialistId)
        );
  
        
        const consultations = specialist.consultation.filter(
          (consultation) => consultation.day == dateValue.split("-")[2]
        );
        
        if (consultations.length < 0) {
          return;
        }

        const timeSelect = document.querySelector("#timeSelect");
        timeSelect.innerHTML = '<option value="">-- Seleccione --</option>';
        const availableTimes = [
          "09:00",
          "10:00",
          "11:00",
          "14:00",
          "15:00",
          "16:00",
          "17:00",
          "18:00",
        ];

        const reducerConsultation = consultations.reduce((acc, curr) => {
          acc.push(curr.time);
          return acc;
        }, []);

        const filteredAvailableTimes = availableTimes.filter(
          (time) => !reducerConsultation.includes(time)
        );

        filteredAvailableTimes.forEach((time) => {
          const option = document.createElement("option");
          option.value = time;
          option.textContent = time;
          timeSelect.appendChild(option);
        });
      };
      getTimeDisponibility();
    }

    storedSpecialty[input.name] = input.value;
    localStorage.setItem("selectedSpecialty", JSON.stringify(storedSpecialty));
  });
});

listSpecialists.addEventListener("change", (event) => {
  storedSpecialty["specialistId"] = event.target.value;
  localStorage.setItem("selectedSpecialty", JSON.stringify(storedSpecialty));
});

especialytiesForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const selectedSpecialty = event.target.querySelector("#especialtySelect");
  if (!selectedSpecialty.value) {
    alert("Please select a specialty.");
    return;
  }

  especialytiesForm.classList.add("d-none");
  programDateForm.classList.remove("d-none");
  specialityEdit.style.transform = "translate(-50%, 0)";

  storedSpecialty["specialty"] = selectedSpecialty.value;
  localStorage.setItem("selectedSpecialty", JSON.stringify(storedSpecialty));
  selectedSpecialtyDisplay.textContent = selectedSpecialty.value;
  const assignedSpecialist = get({
    database: "specialties",
    specialty: selectedSpecialty.value,
  })[0];
  assignedSpecialistDisplay.textContent = assignedSpecialist.name;
  especialytiesForm.reset();
});

programDateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(storedSpecialty);

  const res = schedule({
    day: storedSpecialty.date,
    time: storedSpecialty.timeSelect,
    service: storedSpecialty.specialty,
    fullname: storedSpecialty.name,
    telephone: storedSpecialty.phone,
    email: storedSpecialty.email,
    specialistId: storedSpecialty.specialistId,
    pay: false,
    paymentDate: null,
    codeTransaction: null,
    patientAge: storedSpecialty.age || null,
    patientNotes: storedSpecialty.notes || null,
  });

  localStorage.removeItem("selectedSpecialty");
  programDateForm.reset();

  let seconds = 10;

  programDateContainer.innerHTML = `
  <div class="alert alert-success" role="alert">
    <img src="../../../public/images/congratulation.png" alt="Congratulations" class="img-fluid mb-3" width="100" height="100"/>
    <br />
    Cita agendada con éxito. Su código de validación es: <strong>${res.validCode}</strong><br />
    Por favor, guarde este código para futuras referencias.
    
    Seras redirigido a una pagina con toda la informacion en <span id="countdown">10</span> segundos.
  </div>`;

  const countdownInterval = setInterval(() => {
    document.getElementById("countdown").textContent = seconds;
    seconds--;
    if (seconds <= 0) {
      clearInterval(countdownInterval);
      sessionStorage.setItem("appointmentCode", res.validCode);
      window.location.href = `../appointmentInfo/index.html`;
    }
  }, 1000);

  especialytiesForm.classList.remove("d-none");
  programDateForm.classList.add("d-none");
  specialityEdit.style.transform = "translate(-50%, -50%)";
});
