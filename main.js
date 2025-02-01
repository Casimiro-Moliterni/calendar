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

let on_stream_video = document.querySelector('#camera-stream');
let flipBtn = document.querySelector('#flip-btn');
let canvas = document.createElement('canvas');
let shouldFaceUser = true;
let stream = null;

// Verifica la compatibilità di facingMode
let supports = navigator.mediaDevices.getSupportedConstraints();
if (supports['facingMode']) {
  flipBtn.disabled = false;
}

// Funzione per avviare la fotocamera
function capture() {
  let constraints = {
    audio: false,
    video: {
      facingMode: shouldFaceUser ? 'user' : 'environment',
      width: { min: 192, ideal: 192, max: 192 },
      height: { min: 192, ideal: 192, max: 192 }
    }
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(function(mediaStream) {
      stream = mediaStream;
      on_stream_video.srcObject = stream;
      on_stream_video.play();
    })
    .catch(function(err) {
      console.error('Errore nell\'accesso alla fotocamera:', err);
    });
}

// Funzione per scattare la foto
document.getElementById("capture-camera").addEventListener("click", function() {
  const video = document.querySelector('video');
  if (!video || !video.videoWidth) {
    console.log("Errore: flusso video non disponibile");
    return;
  }

  // Imposta le dimensioni del canvas uguali al video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Disegna l'immagine dal video sul canvas
  canvas.getContext('2d').drawImage(video, 0, 0);

  // Ottieni l'immagine dal canvas come Data URL
  const photoPath = canvas.toDataURL('image/png');
  
  // Mostra l'immagine nella pagina
  document.getElementById('photo').src = photoPath;

  // Mostra il pulsante per salvare la foto
  document.getElementById('save-photo').style.display = 'inline-block';

  // Aggiungi l'evento di salvataggio della foto
  document.getElementById('save-photo').onclick = () => {
    savePhoto(photoPath);
  };
});

// Funzione per salvare la foto come file
function savePhoto(photoPath) {
  const link = document.createElement('a');
  link.href = photoPath;
  link.download = 'foto_catturata.png';
  link.click();
}

// Cambia la fotocamera
flipBtn.addEventListener('click', function() {
  if (stream) {
    // Fermiamo il flusso video corrente
    stream.getTracks().forEach(t => t.stop());
  }
  // Cambia la fotocamera
  shouldFaceUser = !shouldFaceUser;
  capture();
});

// Avvia la fotocamera all'inizio
capture();