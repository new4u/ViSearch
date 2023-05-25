//将visearch的parseweb部分加入content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message in content script:', message);
  if (message.type === 'GET_LAST_ELEMENT') {
const lastElement=document.body
   
    sendResponse({lastElement: lastElement.outerHTML});
    
  

  }
  

  
});
