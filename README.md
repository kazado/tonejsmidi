# Tone.js MIDI Generator

This project utilizes OpenAI's GPT-3.5 model to generate MIDI scores in JSON notation that can be played back using Tone.js. The generated JSON music score includes tracks with labeled notes containing pitch, duration, and startTime. The duration and startTime are represented as numerical integers.

## Instructions for Use:

1. **Dependencies:**
   - Ensure you have the necessary dependencies installed:
     - `@tonejs/midi`
     - `tone@13.4.9`
     - `@tonejs/ui@0.0.8`
     These dependencies are included via CDN links in the HTML file.

2. **Setup:**
   - Clone this repository to your local machine.
   - Open the `index.html` file in a web browser.

3. **Interface:**
   - The interface allows you to adjust between direct generation and code generation of MIDI music.
   - Use the slider to select between direct generation (0) and code generation (1).
   - Click the "Start Generation" button to initiate the MIDI generation process.

4. **Playback:**
   - After initiating the generation process, the generated MIDI music will be played back automatically.
   - The playback can be controlled using the play/pause toggle button.

## Code Overview:

- **JavaScript (main.js):**
  - The `generateCode` function uses OpenAI's API to generate JavaScript code for MIDI music generation based on predefined prompts.
  - The `generateMidiJson` function generates MIDI music directly by calling OpenAI's API with specified prompts.
  - The `loadJson` function loads the generated MIDI JSON based on user selection.
  - The `startPlayback` function starts the playback of the generated MIDI music using Tone.js.

- **HTML (index.html):**
  - Provides the user interface for controlling MIDI generation and playback.
  - Includes necessary scripts for Tone.js and MIDI playback.

## Usage Notes:

- Ensure you have a stable internet connection to utilize the OpenAI API for MIDI generation.
- Adjust the slider between direct generation and code generation to explore different approaches to MIDI music creation.

## Credits:

- This project utilizes OpenAI's GPT-3.5 model for MIDI generation.
- Tone.js library is used for MIDI playback.


For any questions or issues, please open an issue in the GitHub repository. Thank you for using Tone.js MIDI Generator!
