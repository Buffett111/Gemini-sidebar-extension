document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    showIcon();
  } else {
    hideIcon();
  }
});

function showIcon() {
  let icon = document.getElementById('translate-icon');
  if (!icon) {
    icon = document.createElement('img');
    icon.id = 'translate-icon';
    icon.src = chrome.runtime.getURL('images/translate-icon.png'); // Use translate-icon.jpg
    icon.style.position = 'absolute';
    icon.style.cursor = 'pointer';
    icon.style.zIndex = '1000';
    document.body.appendChild(icon);

    icon.addEventListener('click', () => {
      const selectedText = window.getSelection().toString().trim();
      if (selectedText) {
        chrome.runtime.sendMessage({ type: 'updateInputPrompt', selectedText });
      }
    });
  }

  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  icon.style.top = `${rect.top + window.scrollY - 30}px`;
  icon.style.left = `${rect.left + window.scrollX}px`;
  icon.style.display = 'block';
}

function hideIcon() {
  const icon = document.getElementById('translate-icon');
  if (icon) {
    icon.style.display = 'none';
  }
}
