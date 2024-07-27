async function generateCode() {
    let prompt = [
        { role: "system", content: "You write js code that ends with a return of the result. call the function at the end. do not include comments. do not include markdown formatting, and do not include the string javascript at the beginning of the code. do not enclose the code in quotes. You're tasked with creating a JavaScript function that generates a MIDI score in JSON format, playable by Tone.js. The function should return the MIDI score as a JSON object. Make sure the JSON structure is compatible with Tone.js for playback." },
        { role: "assistant", content: "Write a function in js with a complex piano piece with two hands with syncopated rhythms and varied notes labelled as \"tracks\" with each voice labelled as \"notes\" including pitch, duration, startTime in json notation. The pitch should be a note name, duration and startTime should be only numerical integers."}
    ];
    const apiKey = document.getElementById('apiKey').value;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo-1106',
            messages: prompt,
            max_tokens: 500,
        })
    });
    const data = await response.json();
    const generatedCode = data.choices[0].message.content;
    console.log(generatedCode);
    console.log(eval(generatedCode));
    return(eval(generatedCode));
}

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
    const apiKey = document.getElementById('apiKey').value;
    const bearer = 'Bearer ' + apiKey;
    let prompt = [
        { role: "system", content: "You are a composer of classical music. You generate complex piano piece with two hands with syncopated rhythms and varied notes midi scores in json notation labelled as \"tracks\" with each voice labelled as \"notes\" including pitch, duration, startTime in json notation. The pitch should be a note name and duration and startTime should be numerical integers." },
        { role: "assistant", content: "Generate json music" }
    ];

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
        console.log(response);
        return response.json();
    });

    console.log(data);
    console.log(data.choices[0].message.content);
    return JSON.parse(data.choices[0].message.content);
}

var generateMidi = 0;
var midiJson = null;

async function loadJson(generateMidi) {
    var directGen = generateMidi == 0;
    midiJson = await (directGen ? generateMidiJson() : generateCode());

    const downloadButton = document.getElementById('downloadButton');
    if (downloadButton) {
        downloadButton.style.display = 'inline-block';
    }

    return midiJson;
}

document.getElementById('startButton').addEventListener('click', () => {
    generateMidi = document.getElementById('slider').value;
    startPlayback(generateMidi);
});

document.getElementById('downloadButton').addEventListener('click', () => {
    downloadMIDI(midiJson);
});

function startPlayback() {
    Tone.start();
    loadJson(generateMidi).then(openaiGeneratedJson => {
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

function downloadMIDI(jsonData) {
    const midiData = jsonData;
    const tracks = midiData.tracks;
    const midiFile = new Midi();
    
    tracks.forEach(track => {
        const midiTrack = midiFile.addTrack();
        track.notes.forEach(note => {
            midiTrack.addNote({
                midi: Tone.Frequency(note.pitch).toMidi(),
                time: note.startTime,
                duration: note.duration,
            });
        });
    });

    const midiArray = midiFile.toArray();
    const blob = new Blob([midiArray], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_music.mid';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}