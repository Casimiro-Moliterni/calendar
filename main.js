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

// camera stream video element
let on_stream_video = document.querySelector('#camera-stream');
// flip button element
let flipBtn = document.querySelector('#flip-btn');

// default user media options
let constraints = { audio: false, video: true }
let shouldFaceUser = true;

// check whether we can use facingMode
let supports = navigator.mediaDevices.getSupportedConstraints();
if( supports['facingMode'] === true ) {
  flipBtn.disabled = false;
}

let stream = null;

function capture() {
  constraints.video = {
      width: {
      min: 192,
      ideal: 192,
      max: 192,
    },
    height: {
      min: 192,
      ideal: 192,
      max: 192
    },
    facingMode: shouldFaceUser ? 'user' : 'environment'
  }
  navigator.mediaDevices.getUserMedia(constraints)
    .then(function(mediaStream) {
      stream  = mediaStream;
      on_stream_video.srcObject = stream;
      on_stream_video.play();
    })
    .catch(function(err) {
      console.log(err)
    });
}

flipBtn.addEventListener('click', function(){
  if( stream == null ) return
  // we need to flip, stop everything
  stream.getTracks().forEach(t => {
    t.stop();
  });
  // toggle / flip
  shouldFaceUser = !shouldFaceUser;
  capture();
})

capture();

document.getElementById("capture-camera").addEventListener("click", function() {
  // Elements for taking the snapshot
    const video = document.querySelector('video');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
});