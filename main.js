import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'

document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendar')
  const calendar = new Calendar(calendarEl, {
    plugins: [dayGridPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    }
  })
  calendar.render()
})

let currentStream = null;

// Funzione per avviare la fotocamera
function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      currentStream = stream; // Memorizza il flusso per un eventuale arresto
      const video = document.getElementById('video');
      video.srcObject = stream;
      document.getElementById('take-photo').disabled = false; // Abilita il pulsante per scattare foto
    })
    .catch((error) => {
      console.log('Errore nell\'accesso alla fotocamera:', error);
    });
}

// Funzione per scattare una foto
function takePhoto() {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  
  // Imposta le dimensioni del canvas uguali al video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Disegna l'immagine del video sul canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // Ottieni l'immagine dal canvas come Data URL
  const photo = canvas.toDataURL('image/png');
  
  // Mostra l'immagine nel tag <img>
  document.getElementById('photo').src = photo;

  // Salva la foto (opzionale)
  const link = document.createElement('a');
  link.href = photo;
  link.download = 'foto.png';
  link.click();
}

// Aggiungi eventi ai pulsanti
document.getElementById('start-camera').addEventListener('click', startCamera);
document.getElementById('take-photo').addEventListener('click', takePhoto);