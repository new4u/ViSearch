chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message in content script:', message);
  if (message.type === 'GET_LAST_ELEMENT') {
    const lastElement = document.body.lastElementChild;
    console.log('Last element:', lastElement,"lastElement.outerHTML:",lastElement.outerHTML);
    // console.log('Last element:', lastElement);
    // sendResponse({lastElement: lastElement.outerHTML});
    
    sendResponse({lastElement: lastElement.outerHTML});

  }
  
});