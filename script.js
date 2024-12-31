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

const tempoInc = document.getElementById('tempo-inc')
const tempoDec = document.getElementById('tempo-dec')
const tempoInput = document.getElementById('tempo-input')

let currentStep = 0
let isPlaying = false
let bpm = 60

function updateBPM(value) {
    bpm = value
    tempoInput.value = bpm
}

function updateVolume(value) {
    volumeRange.value = value
    volumeLabel.textContent = `volume: ${Math.round(volumeRange.value * 100)}%`
}

const audioContext = new (window.AudioContext || window.webkitAudioContext)()

const sounds_filename = ['bass', 'clap', 'hihat', 'kick', 'openhat', 'ride', 'snare', 'tink', 'tom']
const sounds = {}
sounds_filename.forEach((sound) => {
    fetch(`./sounds/${sound}.wav`)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => {
            sounds[sound] = audioBuffer
        })
})

steps.forEach((step) => {
    step.addEventListener('click', () => {
        step.classList.toggle('active')
    })
})

function updateMetronome(step) {
    metronomeBeats.forEach((beat, index) => {
        beat.classList.toggle('active', index === step % 4)
    })
}

function playSound(sound) {
    const source = audioContext.createBufferSource()
    source.buffer = sounds[sound]

    const gainNode = audioContext.createGain()
    gainNode.gain.value = volumeRange.value

    source.connect(gainNode)
    gainNode.connect(audioContext.destination)

    source.start()
}

function playSequencer() {
    const totalSteps = bar * 16 // 16 beats

    if (!isPlaying) return

    updateMetronome(Math.floor(currentStep / 4))

    steps.forEach((step) => step.classList.remove('playing'))
    const currentSteps = document.querySelectorAll(`[data-index="${currentStep}"]`)
    currentSteps.forEach((step) => {
        step.classList.add('playing')

        if (step.classList.contains('active')) {
            playSound(step.dataset.sound)
        }
    })

    currentStep = (currentStep + 1) % totalSteps

    const interval = ((60 / bpm) * 1000) / 4
    setTimeout(playSequencer, interval)
}

playButton.addEventListener('click', () => {
    isPlaying = !isPlaying
    if (isPlaying) {
        playButton.textContent = 'Stop'
        playSequencer()
    } else {
        playButton.textContent = 'Play'
    }
})

goToBeginningButton.addEventListener('click', () => {
    steps.forEach((step) => {
        step.classList.remove('playing')
    })

    currentStep = 0
    metronomeBeats.forEach((beat) => {
        beat.classList.remove('active')
    })
})

resetButton.addEventListener('click', () => {
    if (!confirm('Are you sure you want to reset?')) return

    steps.forEach((step) => {
        step.classList.remove('active')
        step.classList.remove('playing')
    })

    isPlaying = false
    playButton.textContent = 'Play'
    currentStep = 0
    metronomeBeats.forEach((beat) => {
        beat.classList.remove('active')
    })

    updateBPM(60)
})

tempoInc.addEventListener('click', () => {
    bpm += 5
    tempoInput.value = bpm
})

tempoDec.addEventListener('click', () => {
    updateBPM(bpm - 5)
    if (bpm <= 0) updateBPM(1)
})

trackLabels.forEach((trackLabel) => {
    trackLabel.addEventListener('click', () => {
        playSound(trackLabel.id)
    })
})

tempoInput.addEventListener('change', () => {
    const value = Number(tempoInput.value)
    if (value) {
        bpm = value
    } else {
        tempoInput.value = bpm
    }
})

volumeRange.addEventListener('input', () => {
    volumeLabel.textContent = `volume: ${Math.round(volumeRange.value * 100)}%`
})

randomButton.addEventListener('click', () => {
    steps.forEach((step) => {
        step.classList.toggle('active', Math.random() > 0.7)
    })
})

function saveAsJson() {
    const pattern = {}
    steps.forEach((step) => {
        const index = step.dataset.index
        const sound = step.dataset.sound
        if (step.classList.contains('active')) {
            if (!pattern[sound]) {
                pattern[sound] = []
            }
            pattern[sound].push(index)
        }
    })
    const json = { bpm, volume: volumeRange.value, pattern }
    return JSON.stringify(json, null, 4)
}

function loadFromJson(json) {
    const json_ = JSON.parse(json)

    console.log(json_)

    if (!json_.pattern || !json_.bpm || !json_.volume) {
        alert('Invalid JSON')
        return
    }

    updateBPM(json_.bpm)
    updateVolume(json_.volume)

    const pattern = json_.pattern
    steps.forEach((step) => {
        const index = step.dataset.index
        const sound = step.dataset.sound
        step.classList.toggle('active', pattern[sound] && pattern[sound].includes(index))
    })
}

saveButton.addEventListener('click', () => {
    const json = saveAsJson()
    const filename = prompt('Enter filename', 'sequence.json')

    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename ?? 'sequence.json'
    a.click()
    URL.revokeObjectURL(url)
})

loadButton.addEventListener('click', () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = (event) => {
        const file = event.target.files[0]
        const reader = new FileReader()
        reader.onload = (event) => {
            const json = event.target.result
            loadFromJson(json)
        }
        reader.readAsText(file)
    }
    input.click()
})