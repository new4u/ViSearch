document.getElementById('get-last-element').addEventListener('click', () => {
  chrome.runtime.sendMessage({type: 'GET_LAST_ELEMENT'}, (response) => {
    console.log('Received response in popup:', response);
    // d3.select('#display').html(response.lastElement);
    d3.select('#display').html(response);

  });
});