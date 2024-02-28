function createSynth() {
    return new Tone.PolySynth(10, Tone.Synth, {
        envelope: {
            attack: 0.02,
            decay: 0.1,
            sustain: 0.3,
            release: 1
        }
    }).toMaster();
}

async function generateMidiJson() {

    const apiKey = '';
    const prompt = 'Generate JSON data for a music piece';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model : 'gpt-3.5-turbo-1106',
            prompt: prompt,
            max_tokens: 500,  
        }),
    });

    const jsonData = await response.json();
    console.log(jsonData.choices[0].text);

    return JSON.parse(jsonData.choices[0].text);
}

async function loadJson() {
    // const response = await fetch("https://raw.githubusercontent.com/kazado/tonejsmidijson/main/myfile.json");
    // const jsonData = await response.json();
    
    // console.log(jsonData); 

    // return jsonData;
    const openaiGeneratedJson = await generateMidiJson();
    return openaiGeneratedJson;
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