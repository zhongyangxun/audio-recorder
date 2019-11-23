import './index.scss';

const URL = window.URL || window.webkitURL;
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const rec = Recorder({
  type: "mp3",
  sampleRate: 16000,
  bitRate: 16
});

let wavesurfer; // WaveSurfer object depends on WaveSurfer.js(https://wavesurfer-js.org/).
let objectURL;
let context; // Audio context instance(in Safari).
let processor; // ScriptProcessorNode instance to process audio(in Safari).

const recordButton = document.getElementById('recordButton');
const stopButton = document.getElementById('stopButton');
const playButton = document.getElementById('playButton');
const downloadButton = document.getElementById('downloadButton');

recordButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);
playButton.addEventListener('click', toggleWavePlay);

function loadWave(blob) {
  wavesurfer.empty();
  objectURL = URL.createObjectURL(blob);
  wavesurfer.load(objectURL);
}

// Init the waveSurfer object.
function initWaveSurfer() {
  if (isSafari) {
    // Safari 11 or newer automatically suspends new AudioContext's that aren't
    // created in response to a user-gesture, like a click or tap, so create one
    // here (inc. the script processor)
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
    processor = context.createScriptProcessor(1024, 1, 1);
  }

  wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'violet',
    progressColor: 'purple',
    cursorColor: 'white',
    audioContext: context || null,
    audioScriptProcessor: processor || null,
    plugins: [
      // Using microphone plugin to create wave when recording.
      WaveSurfer.microphone.create()
    ]
  });

  wavesurfer.on('ready', () => {
    if (stopButton.disabled === true) {
      playButton.disabled = false;
    }
  });

  wavesurfer.on('play', () => {
    playButton.innerText = 'Pause';
  });

  wavesurfer.on('pause', () => {
    playButton.innerText = 'Play';
  });

  wavesurfer.microphone.on('deviceReady', function (stream) {
    console.log('Device ready!', stream);
    record(stream);
  });
}

// Reset the waveSurfer object.
function resetWaveSurfer() {
  if (wavesurfer.isReady) {
    playButton.disabled = true;
    wavesurfer.empty();

    if (objectURL !== undefined) {
      URL.revokeObjectURL(objectURL);
    }
  }
}

function record(stream) {
  rec.open(function () {
    rec.start();
  });

  recordButton.disabled = true;
  stopButton.disabled = false;
  playButton.disabled = true;
  downloadButton.disabled = true;

  console.log('Recording started');
}

function startRecording() {
  if (wavesurfer !== undefined) {
    resetWaveSurfer();
  } else {
    initWaveSurfer();
  }

  wavesurfer.microphone.start();
}

function stopRecording() {
  wavesurfer.microphone.stop();

  stopButton.disabled = true;
  recordButton.disabled = false;

  rec.stop(function (blob) {
    rec.close();
    loadWave(blob);
    enableDownload(blob);
  }, function () {
    console.log('Record failed');
  });
}

function toggleWavePlay() {
  wavesurfer.playPause();
}

function enableDownload(blob) {
  const downloadLinkEl = document.getElementById('download-link');
  const fileName = new Date().toLocaleString() + 'mp3';
  downloadLinkEl.href = URL.createObjectURL(blob);
  downloadLinkEl.download = fileName;

  downloadButton.disabled = false;
}
