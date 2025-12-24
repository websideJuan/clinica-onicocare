export const agenda = [
  {
    validCode: "HSAD1234",
    day: '01/01/2026',
    time: "09:00 AM",
    service: "Onicomicosis Treatment",
    firstname: "Clarita",
    lastname: "Gomez",
    telephone: "+56 9 8765 4321",
    email: "clarita.gomez@example.com"
  },  
  { 
    validCode: "HSAD1235",
    day: '31/12/2025',
    time: "10:00 AM",
    service: "Onicomicosis Treatment",
    firstname: "Alberto",
    lastname: "Fernandez",
    telephone: "+56 9 1234 5678",
    email: "alberto@example.com",
  },
  {
    validCode: "HSAD1236",
    day: '29/12/2025',
    time: "11:00 AM",
    service: "Consultation",
    firstname: "Olga",
    lastname: "Martinez",
    telephone: "+56 9 2345 6789",
    email: "olga.martinez@example.com",
  },
  {
    validCode: "HSAD1237",
    day: '23/12/2025',
    time: "12:30 PM",
    service: "Diabetic Foot Care",
    firstname: "Ricardo",
    lastname: "Lopez",
    telephone: "+56 9 3456 7890",
    email: "ricardo.lopez@example.com"
  }
]

export const specialist = [
  {
    id: 1,
    name: "Dr. Juan Perez",
    specialty: ['Ortopodologia','Podologia Geriatrica', 'Podologia General'],
    contact: "+56 9 4567 8901",
    consultation: [
      { day: "22", month: "12", time: "09:00", available: true, validCode: "HSAD1234" },
    ],
    image:"https://img.freepik.com/foto-gratis/hermosa-joven-doctora-mirando-camara-oficina_1301-7807.jpg?semt=ais_hybrid&w=740&q=80"
  },
  {
    id: 2,
    name: "Dra. Maria Rodriguez",
    specialty: ['Podologia Pediatrica','Biomecanica', 'Podologia General'],
    contact: "+56 9 5678 9012",
    consultation: [
      { day: "23", month: "12", time: "10:00", available: false, validCode: "HSAD1235" },
    ],
    image:"https://plus.unsplash.com/premium_photo-1658506671316-0b293df7c72b?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG9jdG9yfGVufDB8fDB8fHww"
  },
  {
    id: 3,
    name: "Dr. Luis Gomez",
    specialty: ['Podologia Clinica','Podologia General'],
    contact: "+56 9 7890 1234",
    consultation: [
      { day: "24", month: "12", time: "11:00", available: false, validCode: "HSAD1236" },
    ],
    image: "https://img.freepik.com/fotos-premium/confiado-mi-capacidad-medica-retrato-recortado-atractiva-joven-doctora-pie-brazos-cruzados-oficina_590464-2228.jpg?semt=ais_hybrid&w=740&q=80"
  },
  {
    id: 4,
    name: "Dr. Carlos Sanchez",
    specialty: ['Podologia Deportiva','Cirugia Podologica'],
    contact: "+56 9 6789 0123",
    consultation: [
      { day: "25", month: "12", time: "12:30", available: false, validCode: "HSAD1237" },
    ],
    image: "https://png.pngtree.com/png-clipart/20250311/original/pngtree-charismatic-doctorsmiling-at-the-camera-doctor-healthcare-workers-photo-png-image_20638229.png"
  }
]

const storedAgenda = JSON.parse(localStorage.getItem('agenda')) || agenda;
const storedSpecialist = JSON.parse(localStorage.getItem('specialist')) || specialist;

const validTypes = {
  day: 'string',
  time: 'string',
  service: 'string',
  firstname: 'string',
  lastname: 'string',
  telephone: 'string',
  email: 'string'
};

const createValidCode = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (let i = 0; i < 4; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return code;
}




const isValidType = (type) => {
  return Object.values(validTypes).includes(type);
}

export const schedule = (newItem) => {
  for (const key in newItem) {
    if (isValidType(key)) {
      throw new Error(`Invalid type for property ${key}`);
    }
  }

  

  newItem.validCode = createValidCode();

  storedAgenda.push(newItem);
  const specialistIndex = storedSpecialist.findIndex(s => s.id === parseInt(newItem.specialistId));
  

  const specialist = storedSpecialist[specialistIndex];
  
  specialist.consultation.push({
    day: newItem.day.split('-')[2],
    month: newItem.day.split('-')[1],
    time: newItem.time,
    available: false,
    validCode: newItem.validCode
  });



  localStorage.setItem('agenda', JSON.stringify(storedAgenda));
  localStorage.setItem('specialist', JSON.stringify(storedSpecialist));
  

  return { 
    success: true,
    message: 'Appointment scheduled successfully',
    validCode: newItem.validCode
  };
}

export const deleteByValidCode = (validCode) => {

  const index = storedAgenda.findIndex(item => item.validCode === validCode);
  if (index === -1) {
    return {
      success: false,
      message: 'No appointment found with the provided valid code'
    };
  }
  storedAgenda.splice(index, 1);
  localStorage.setItem('agenda', JSON.stringify(storedAgenda));
  return {  
    success: true,
    message: 'Appointment deleted successfully'
  };
}


export const removeLast = () => {
  agenda.pop();
}

export const clear = () => {
  agenda.length = 0;
} 

export const update = (validCode, updatedItem) => {
  const index = storedAgenda.findIndex(item => item.validCode === validCode);
  if (index === -1) {
    return {
      success: false,
      message: 'No appointment found with the provided valid code'
    };
  }
  storedAgenda[index] = { ...storedAgenda[index], ...updatedItem };
  localStorage.setItem('agenda', JSON.stringify(storedAgenda));
  return {  
    success: true,
    message: 'Appointment updated successfully'
  };
}

export const get = ({ database, specialty }) => {
  if (database === 'agenda') {
    return storedAgenda;
  } else if (database === 'specialties') {
    if (specialty) {
      console.log('database: speciality', specialty);
      
      return specialist.filter(s => s.specialty.includes(specialty));
    }
    return specialist;
  } else if (database === 'specialist') {
    return storedSpecialist;
  } else {
    throw new Error('Unknown database'); 
  }
}

export const getByValidCode = (validCode) => {
  if (validCode === undefined) {
    return undefined;
  }

  const agendaFinded = storedAgenda.find(item => item.validCode === validCode)
  console.log(agendaFinded ? agendaFinded : null);
  
  return agendaFinded ? agendaFinded : 'null';
}