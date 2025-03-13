# Using the Gemini API in a Chrome Extension

This is my first Chrome extension that uses the Gemini Cloud API.

## Overview

The extension provides a chat interface for the Gemini API. To learn more about the API, head over to the [Gemini API documentation](https://ai.google.dev/gemini-api/docs/).

## Running this extension

1. Clone this repository.
2. Navigate to the project directory and install the dependencies by running:
   ```sh
   npm install
   ```
3. [Retrieve an API key](https://ai.google.dev/gemini-api/docs/api-key) and update the `GEMINI_API_KEY` in the `.env` file.
4. Compile the JS bundle for the sidepanel implementation by running:
   ```sh
   npm run build
   ```
5. Load this directory in Chrome as an [unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked).
6. Click the extension icon.
7. Interact with the prompt API in the sidebar.

## Features

- Chat interface to interact with the Gemini API.
- Adjustable temperature settings for response generation.
- Proficiency level selection for generating content at different English proficiency levels.
- Translation feature to translate selected text into Traditional Chinese.

## Files

- `sidepanel/index.html`: The HTML file for the side panel interface.
- `sidepanel/index.css`: The CSS file for styling the side panel.
- `sidepanel/index.js`: The JavaScript file for handling the side panel logic.
- `service-worker.js`: The service worker for background tasks.
- `manifest.json`: The manifest file for the Chrome extension.
- `.env`: The environment file to store the API key (not included in version control).
