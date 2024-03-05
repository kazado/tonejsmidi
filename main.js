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

    const url = 'https://api.openai.com/v1/chat/completions'
    const apiKey = '';
    const bearer = 'Bearer ' + apiKey
    let prompt = [
        { role: "system", content: "You are composer of classical music. You generate midi scores in json notation that can be played back by Tone.js." },
        { role: "assistant", content: "Generate a Bach Chorale" }
    ];
    console.log(prompt)
    console.log(bearer)

    const data = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo-1106',
            messages: prompt,
            max_tokens: 500,
            response_format: { type: "json_object" }

        }),
    }).then(response => {
        console.log(response)
        return response.json()
    });

    console.log(data);

    console.log(data.choices[0].message.content);
    console.log(data);
    return JSON.parse(data.choices[0].message.content);
}

async function loadJson() {
    const openaiGeneratedJson = await generateMidiJson();
    return openaiGeneratedJson;
}

function startPlayback() {
    Tone.start();
    
    loadJson().then(openaiGeneratedJson => {
        const synths = [];

        document.querySelector('tone-play-toggle').removeAttribute('disabled');
        document.querySelector('#Status').textContent = '';

        document.querySelector('tone-play-toggle').addEventListener('play', (e) => {
            const playing = e.detail;

            if (playing) {
                const now = Tone.now() + 0.5;

                openaiGeneratedJson.tracks.forEach(track => {
                    const synth = createSynth();
                    synths.push(synth);

                    track.notes.forEach(note => {
                        const startTime = note.startTime + now;
                        const duration = note.duration;

                        synth.triggerAttackRelease(note.pitch, duration, startTime);
                    });
                });
            } else {
                while (synths.length) {
                    const synth = synths.shift();
                    synth.dispose();
                }
            }
        });
    });
}
document.getElementById('startButton').addEventListener('click', startPlayback);