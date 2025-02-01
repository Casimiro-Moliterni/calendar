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
let currentCamera = 'environment'; // Fotocamera posteriore di default
let currentVideoTrack = null; // Tieniamo traccia del video track per fermarlo facilmente

// Funzione per avviare la fotocamera
function startCamera(facingMode = 'environment') {
  // Ferma il flusso video precedente, se presente
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }

  // Chiedi l'accesso alla fotocamera con il facingMode (posteriore o frontale)
  navigator.mediaDevices.getUserMedia({ video: { facingMode } })
    .then((stream) => {
      currentStream = stream;
      const video = document.getElementById('video');
      video.srcObject = stream;

      // Memorizza il video track per poterlo fermare più tardi
      currentVideoTrack = stream.getVideoTracks()[0];
    })
    .catch((error) => {
      console.error('Errore nell\'accesso alla fotocamera:', error);
    });
}

// Funzione per scattare la foto
function takePhoto() {
  const video = document.getElementById('video');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // Imposta le dimensioni del canvas uguali al video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Disegna l'immagine dal video sul canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Ottieni l'immagine dal canvas come Data URL
  const photoPath = canvas.toDataURL('image/png'); // Salva come Data URL (base64)

  // Mostra l'immagine nella pagina
  document.getElementById('photo').src = photoPath;

  // Mostra il pulsante per salvare la foto
  document.getElementById('save-photo').style.display = 'inline-block';

  // Aggiungi l'evento di salvataggio della foto
  document.getElementById('save-photo').onclick = () => {
    savePhoto(photoPath);
  };
}

// Funzione per salvare la foto come file
function savePhoto(photoPath) {
  const link = document.createElement('a');
  link.href = photoPath;
  link.download = 'foto_catturata.png';
  link.click();
}

// Funzione per cambiare la fotocamera
function toggleCamera() {
  // Cambia la fotocamera tra frontale e posteriore
  currentCamera = (currentCamera === 'environment') ? 'user' : 'environment';
  startCamera(currentCamera);
}

// Avvia la fotocamera al caricamento della pagina
window.onload = () => startCamera(currentCamera);

// Aggiungi l'evento per scattare la foto
document.getElementById('take-photo').addEventListener('click', takePhoto);

// Aggiungi l'evento per cambiare la fotocamera
document.getElementById('toggle-camera').addEventListener('click', toggleCamera);