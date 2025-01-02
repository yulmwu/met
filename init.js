let params = {};

window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, (str, key, value) => {
    params[key] = value
});

let bar = params['bar'] ? parseInt(params['bar']) : 4

function createTrack(trackName, color) {
    const track = document.createElement('div')
    track.classList.add('track')
    track.id = color

    const trackLabel = document.createElement('span')
    trackLabel.textContent = trackName.charAt(0).toUpperCase() + trackName.slice(1)
    trackLabel.classList.add('track-label')
    trackLabel.id = trackName
    track.appendChild(trackLabel)

    const steps = document.createElement('div')
    steps.classList.add('steps')
    track.appendChild(steps)

    for (let i = 0; i < bar * 4; i++) {
        const measure = document.createElement('div')
        measure.classList.add('measure')
        steps.appendChild(measure)

        for (let j = 0; j < 4; j++) {
            const step = document.createElement('div')
            step.classList.add('step')
            step.dataset.sound = trackName
            step.dataset.index = i * 4 + j
            measure.appendChild(step)
        }
    }

    return track
}

function createBarsInfo() {
    const track = document.createElement('div')
    track.classList.add('track')

    const trackLabel = document.createElement('span')
    trackLabel.classList.add('track-label')
    track.appendChild(trackLabel)

    const steps = document.createElement('div')
    steps.classList.add('steps')
    track.appendChild(steps)

    for (let i = 0; i < bar; i++) {
        for (let j = 0; j < 4; j++) {
            const measure = document.createElement('div')
            measure.classList.add('measure')
            steps.appendChild(measure)

            for (let k = 0; k < 4; k++) {
                if (k == 0 && j == 0) {
                    const infoBar = document.createElement('div')
                    infoBar.classList.add('info-bar')
                    infoBar.textContent = i + 1
                    measure.appendChild(infoBar)
                } else {
                    const infoBar = document.createElement('div')
                    infoBar.classList.add('info-bar')
                    measure.appendChild(infoBar)
                }
            }
        }
    }

    return track
}

const sequencer = document.querySelector('.sequencer')

sequencer.appendChild(createBarsInfo())
sequencer.appendChild(createTrack('bass', 'color-red'))
sequencer.appendChild(createTrack('clap', 'color-blue'))
sequencer.appendChild(createTrack('hihat', 'color-green'))
sequencer.appendChild(createTrack('kick', 'color-yellow'))
sequencer.appendChild(createTrack('openhat', 'color-purple'))
sequencer.appendChild(createTrack('ride', 'color-orange'))
sequencer.appendChild(createTrack('snare', 'color-pink'))
sequencer.appendChild(createTrack('tink', 'color-grey'))
sequencer.appendChild(createTrack('tom', 'color-brown'))

const steps = document.querySelectorAll('.step')
const playButton = document.getElementById('play-button')
const goToBeginningButton = document.getElementById('go-to-beginning-button')
const resetButton = document.getElementById('reset-button')
const randomButton = document.getElementById('random-button')
const saveButton = document.getElementById('save-button')
const loadButton = document.getElementById('load-button')

const metronomeBeats = document.querySelectorAll('#metronome .beat')

const trackLabels = document.querySelectorAll('.track-label')

const volumeLabel = document.querySelector('.volume-label')
const volumeRange = document.querySelector('.volume-range')

const autoScroll = document.getElementById('auto-scroll-checkbox')

const tempoInc = document.getElementById('tempo-inc')
const tempoDec = document.getElementById('tempo-dec')
const tempoInput = document.getElementById('tempo-input')
