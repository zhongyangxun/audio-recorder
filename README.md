# Audio Recorder

A audio-record demo, with recording audio wave and playing audio wave.

## Experience it online

[click me](https://zhongyangxun.github.io/audio-recorder/dist)   



## How to run

Install [Parcel]( https://parceljs.org/ ):

```shell
npm install -g parcel-bundler
```

Go to the demo root folder and install dependencies:

``` shell
npm install
```

Run:

```shell
npm start
```

Visit http://localhost:1234/.

Build:

```shell
npm run build
```



## Detail

### Record

Using  [Recorder]( https://github.com/xiangyuecn/Recorder ) lib to record audio.

Initiate:

```javascript
const rec = Recorder({
  type: "mp3",
  sampleRate: 16000,
  bitRate: 16
});
```

Start:

```javascript
rec.open(function () {
  rec.start();
});
```

Stop and process audio data:

```javascript
rec.stop(function (blob) {
  rec.close();
  // Show audio wave.
  loadWave(blob);
  // Enable audio download. 
  enableDownload(blob);
}, function () {
  console.log('Record failed');
});
```



### Wave

The audio wave is generated with  [Wavesurfer.js]( https://wavesurfer-js.org/ ).

HTML code:

```html
<!-- Wave container -->
<div id="waveform"></div>

<script src="https://unpkg.com/wavesurfer.js"></script>
<!-- Microphone plugin for recording wave -->
<script src="https://unpkg.com/wavesurfer.js/dist/plugin/wavesurfer.microphone.min.js"></script>
```

Initiate:

```javascript
const wavesurfer = WaveSurfer.create({
  container: '#waveform',
  waveColor: 'violet',
  progressColor: 'purple',
  cursorColor: 'white',
  plugins: [
    // Using microphone plugin to create wave when recording.
    WaveSurfer.microphone.create()
  ]
});
```

Generate playing wave with `load` method and   [`ObjectURL`]( https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL ):

```java
function loadWave(blob) {
  objectURL = URL.createObjectURL(blob);
  wavesurfer.load(objectURL);
}
```

Recording wave is created by  [microphone plugin]( https://wavesurfer-js.org/plugins/microphone.html ) of WaveSurfer.js, when the `start` method below is success, the wave is generated.

```javascript
wavesurfer.microphone.start();
```

### Download

HTML:

```javascript
<button class="btn btn-download" id="downloadButton" disabled>
  Download
  <a href="#" class="download-link" id="download-link" download></a>
</button>
```

Style (Hide the `a` tag when download button was disabled):

```scss
.btn-download {
  position: relative;

  &:disabled {
    a {
      display: none;
    }
  }

  a {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
```

JavaScript:

```javascript
function enableDownload(blob) {
  const downloadLinkEl = document.getElementById('download-link');
  const fileName = new Date().toLocaleString() + 'mp3';
  downloadLinkEl.href = URL.createObjectURL(blob);
  downloadLinkEl.download = fileName;

  downloadButton.disabled = false;
}
```

