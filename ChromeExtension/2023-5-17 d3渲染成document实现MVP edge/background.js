chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message in background:', message);
  if (message.type === 'GET_LAST_ELEMENT') {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (chrome.runtime.lastError) {
        console.error('Error querying tabs:', chrome.runtime.lastError.message);
        sendResponse({error: chrome.runtime.lastError.message});
        return;
      }
      if (tabs.length === 0) {
        console.error('No active tabs found');
        sendResponse({error: 'No active tabs found'});
        return;
      }
      chrome.tabs.sendMessage(tabs[0].id, {type: 'GET_LAST_ELEMENT'}, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message to content script:', chrome.runtime.lastError.message);
          sendResponse({error: chrome.runtime.lastError.message});
          return;
        }
        console.log('Received response from content script:', response);
        sendResponse(response);
      });
    });
    return true;
  }
});