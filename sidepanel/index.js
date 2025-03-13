import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory
} from '../node_modules/@google/generative-ai/dist/index.mjs';

// Replace YOUR_API_KEY with your API key
// You can get an API key by following the instructions at https://cloud.google.com/docs/authentication/api-keys
const apiKey = "YOUR_API_KEY";

let genAI = null;
let model = null;
let generationConfig = {
  temperature: 1
};

const inputPrompt = document.body.querySelector('#input-prompt');
const buttonPrompt = document.body.querySelector('#button-prompt');
const elementResponse = document.body.querySelector('#response');
const elementLoading = document.body.querySelector('#loading');
const elementError = document.body.querySelector('#error');
const sliderTemperature = document.body.querySelector('#temperature');
const labelTemperature = document.body.querySelector('#label-temperature');
const proficiencyLevel = document.body.querySelector('#proficiency-level');
const elementConsole = document.body.querySelector('#console');
const toggleTranslationButton = document.body.querySelector('#toggle-translation');
const translationSection = document.body.querySelector('#translation-section');

toggleTranslationButton.addEventListener('click', () => {
  if (translationSection.hasAttribute('hidden')) {
    translationSection.removeAttribute('hidden');
    toggleTranslationButton.textContent = 'Hide Translation';
  } else {
    translationSection.setAttribute('hidden', '');
    toggleTranslationButton.textContent = 'Show Translation';
  }
});

function initModel(generationConfig) {
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE
    }
  ];
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    safetySettings,
    generationConfig
  });
  return model;
}

async function runPrompt(prompt) {
  try {
    console.log('Prompt:', prompt);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (e) {
    console.log('Prompt failed');
    console.error(e);
    console.log('Prompt:', prompt);
    throw e;
  }
}

sliderTemperature.addEventListener('input', (event) => {
  labelTemperature.textContent = event.target.value;
  generationConfig.temperature = event.target.value;
});

inputPrompt.addEventListener('input', () => {
  if (inputPrompt.value.trim()) {
    buttonPrompt.removeAttribute('disabled');
  } else {
    buttonPrompt.setAttribute('disabled', '');
  }
});

chrome.storage.session.get('lastWord', ({ lastWord }) => {
  updateDefinition(lastWord);
});

async function updateDefinition(word) {
  if (!word) return;
  if (word) {
    inputPrompt.value = word;
    buttonPrompt.removeAttribute('disabled');
    //chrome.storage.local.remove("selectedText");
  }
  // Hide instructions.
  document.body.querySelector('#select-a-word').style.display = 'none';

  // Show word and definition.
  //document.body.querySelector('#definition-word').innerText = word;

  //use gemini to translate the word into Traditional Chinese
  const response = await GeminiTranslate(word);
  const paragraphs = response.split(/\r?\n/);
  
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    if (paragraph) {
      document.body.querySelector('#definition-text').appendChild(document.createTextNode(paragraph));
    }
    // Don't add a new line after the final paragraph
    if (i < paragraphs.length - 1) {
      document.body.querySelector('#definition-text').appendChild(document.createElement('BR'));
    }
  }

};

function getProficiencyLevelDescription(level) {
  var description = '';
  switch (level) {
    case 'A1':
        description =
          'Generate according to the prompt below but make sure that the generated text is at the A1 level of English proficiency. ' +
          'and keep the sentences as simple as possible' +
          'As a reminder, A1 proficiency is described as:' +
          '## A1 (Beginner)' +
          'The writing uses familiar names, words and very simple sentences, for example as seen on notices and posters or in catalogues.' +
          '- Includes the top most frequent 1,000 commonly spoken words in the language' +
          '- Includes many words and phrases that fall under common early language learning topics (e.g. common greeting, travel, dining, shopping, etc)' +
          '- Includes all proper nouns (country names, person names, etc)' +
          '- Includes all cognates shared with English' +
          '- Includes all words that look similar to English words that share a similar meaning'
      break;
    case 'A2':
      description =
          'Generate according to the prompt below but make sure that the generated text is at the A2 level of English proficiency. ' +
          'As a reminder, A2 proficiency is described as:' +
          '## A2 (Elementary)' +
          'The writing involves short, simple texts with specific, predictable information. Examples include simple everyday material such as advertisements, prospectuses, menus, and timetables or short simple personal letters.' +
          '- Includes the top most frequent 1,000-2,000 commonly spoken words in the language'
      break;
    case 'B1':
      description =
          'Generate according to the prompt below but make sure that the generated text is at the B1 level of English proficiency. ' +
          'As a reminder, B1 proficiency is described as:' +
          '## B1 (Intermediate)' +
          'Texts that consist mainly of high-frequency everyday or job-related language. These involve descriptions of events, feelings, and wishes in personal letters.' +
          '- Includes the top 2,000-5,000 commonly spoken words in the language' +
          '- Includes several rarer verb tenses (e.g. conditional, subjunctive, etc)' +
          '- Includes some relatively common idiomatic phrases'
      break;
    case 'B2':
      description =
          'Generate according to the prompt below but make sure that the generated text is at the B2 level of English proficiency. ' +
          'As a reminder, B2 proficiency is described as:' +
          '## B2 (Upper Intermediate)' +
          'Writing as seen in articles and reports concerned with contemporary problems in which the writers adopt particular attitudes or viewpoints. Also includes contemporary literary prose.' +
          '- Includes the top 5,000-10,000 commonly spoken words in the language'
      break;
    case 'C1':
      description =
          'Generate according to the prompt below but make sure that the generated text is at the C1 level of English proficiency. ' +
          'use complex vocabulary and sentence structures, the sentences should be as difficult as possible, let the users challenge their listening and reading skills' +
          'As a reminder, C1 proficiency is described as:' +
          '## C1 (Proficient)' +
          'Writing can include long and complex factual and literary texts, with distinctions of style. Examples include specialized articles and longer technical instructions, even when they do not relate to a well-known field.' +
          '- Includes the top 10,000-20,000 commonly spoken words in the language'
      break;
    case 'C2':
      description =
          'Generate according to the prompt below but make sure that the generated text is at the C2 level of English proficiency. ' +
          'use complex vocabulary and sentence structures, the sentences should be as difficult as possible, let the users challenge their listening and reading skills' +
          'As a reminder, C2 proficiency is described as:' +
          '## C2 (Advanced Proficient)' +
          'Includes virtually all forms of the written language, including abstract, structurally, or linguistically complex texts such as manuals, specialized articles, and literary works.' +
          '- Includes esoteric technical language'
      break;
    default:
      description = 'Please select a proficiency level,current level is: ' + level;
      break;
  }
  return description;
}

 async function GeminiTranslate(sentence) {
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE
    }
  ];
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    safetySettings,
    generationConfig
  });
  const prompt =
    'You are a professional translator that can translate the following sentence into Traditional Chinese. ' +
    'You should only return the  besttranslation of the sentence, do not add any additional information. ' +
    'The sentence is: ' + sentence;

    const response = await runPrompt(prompt);

    //parse the response
    return response;
}

buttonPrompt.addEventListener('click', async () => {
  const prompt = inputPrompt.value.trim();
  const level = proficiencyLevel.value;
  const systemPrompt = 
    'You are a large language model that can generate content at a certain proficiency level suitable for English language learners. ' +
    'Your goal is to output content and text at the proficiency level specified in the prompt. ' +
    `The descriptions of the proficiency levels are given as follows:\n\n${getProficiencyLevelDescription(level)}\n`+
    `Refine the following sentence to ${level} CEFR level: ${prompt}`;

  //showConsole(systemPrompt);
  showLoading();
  try {
    const generationConfig = {
      temperature: sliderTemperature.value
    };
    initModel(generationConfig);
    const response = await runPrompt(systemPrompt, generationConfig);
    showResponse(response);
  } catch (e) {
    showError(e);
  }
});

function showConsole(message) {
  elementConsole.textContent = message;
  show(elementConsole);
}

function showLoading() {
  hide(elementResponse);
  hide(elementError);
  show(elementLoading);
}

function showResponse(response) {
  hide(elementLoading);
  show(elementResponse);
  // Make sure to preserve line breaks in the response
  elementResponse.textContent = '';
  const paragraphs = response.split(/\r?\n/);
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    if (paragraph) {
      elementResponse.appendChild(document.createTextNode(paragraph));
    }
    // Don't add a new line after the final paragraph
    if (i < paragraphs.length - 1) {
      elementResponse.appendChild(document.createElement('BR'));
    }
  }
}

function showError(error) {
  show(elementError);
  hide(elementResponse);
  hide(elementLoading);
  elementError.textContent = error;
}

function show(element) {
  element.removeAttribute('hidden');
}

function hide(element) {
  element.setAttribute('hidden', '');
}
