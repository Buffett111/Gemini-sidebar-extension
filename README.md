# Gemini Sentence Rephraser

This Chrome extension uses the Gemini Cloud API to provide a sentence rephraser and translation tool. It allows users to highlight text, rephrase sentences, and translate selected text into Traditional Chinese.

## Overview

The extension provides a chat interface for the Gemini API and a context menu option to refine sentences. When text is highlighted, an icon appears, allowing users to click and get the translation in the side panel.

**note**: You need an API key from Gemini to run this extension

## Features

- **Sentence Rephraser**: Rephrase sentences to different English proficiency levels.
- **Translation**: Translate selected text into Traditional Chinese.
- **Temperature Adjustment**: Adjust the temperature setting for response generation.
- **Proficiency Level Selection**: Generate content at different English proficiency levels.

## Running this Extension

1. Clone this repository.
2. Navigate to the project directory and install the dependencies by running:
   ```sh
   npm install
   ```
3. [Retrieve an API key](https://cloud.google.com/docs/authentication/api-keys) and update the `apiKey` variable in `sidepanel/index.js`.
4. Compile the JS bundle for the side panel implementation by running:
   ```sh
   npm run build
   ```
5. Load this directory in Chrome as an [unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked).
6. Highlight text on any webpage to see the translation icon.
7. Click the icon to see the translation in the side panel.

## Files

- `sidepanel/index.html`: The HTML file for the side panel interface.
- `sidepanel/index.css`: The CSS file for styling the side panel.
- `sidepanel/index.js`: The JavaScript file for handling the side panel logic.
- `service-worker.js`: The service worker for background tasks.
- `content-script.js`: The content script to handle text selection and display the icon.
- `manifest.json`: The manifest file for the Chrome extension.
- `.env`: The environment file to store the API key (not included in version control).

## License

This project is licensed under the MIT License.
