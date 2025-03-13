chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

function setupContextMenu() {
  chrome.contextMenus.create({
    id: 'refine-sentence',
    title: 'Refine the sentence',
    contexts: ['selection']
  });
}

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});

chrome.contextMenus.onClicked.addListener((data, tab) => {
  // Store the last word in chrome.storage.session.
  chrome.storage.session.set({ lastWord: data.selectionText });

  // Make sure the side panel is open.
  chrome.sidePanel.open({ tabId: tab.id });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'updateInputPrompt' && request.selectedText) {
    chrome.storage.session.set({ lastWord: request.selectedText });

    // Send message to side panel to update inputPrompt
    chrome.runtime.sendMessage({ type: 'updateInputPrompt', selectedText: request.selectedText });

    // Make sure the side panel is open.
    chrome.sidePanel.open({ tabId: sender.tab.id });
  }
});