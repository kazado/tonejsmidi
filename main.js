async function createSynth() {
    return new Tone.PolySynth(10, Tone.Synth, {
        envelope: {
            attack: 0.02,
            decay: 0.1,
            sustain: 0.3,
            release: 1
        }
    }).toMaster();
}

async function loadJson() {
    const response = await fetch("https://raw.githubusercontent.com/kazado/tonejsmidijson/main/myfile.json");
    return response.json();
}

function startPlayback() {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {
    Tone.start();
    loadJson().then(jsonData => {

    document.querySelector('tone-play-toggle').removeAttribute('disabled')
    document.querySelector('#Status').textContent = ''

    const synths = []
    document.querySelector('tone-play-toggle').addEventListener('play', (e) => {
        const playing = e.detail
        if (playing) {
            const now = Tone.now() + 0.5
            jsonData.tracks.forEach(track => {
                const synth = createSynth();
                synths.push(synth)
                track.notes.forEach(note => {
                    synth.triggerAttackRelease(note.name, note.duration, note.time + now, note.velocity)
                })
            })
        } else {
            while (synths.length) {
                const synth = synths.shift()
                synth.dispose()
            }
        }
    });
});
});
}
document.getElementById('startButton').addEventListener('click', startPlayback);