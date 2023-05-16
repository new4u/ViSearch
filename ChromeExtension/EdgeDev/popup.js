// popup.js
// Get the HTML elements
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

// Add a click event listener to the search button
searchButton.addEventListener("click", () => {
  // Get the input value
  const keyword = searchInput.value;
  // Check if the input is not empty
  if (keyword) {
    // Send a message to the background script with the keyword
    chrome.runtime.sendMessage({ keyword: keyword }, (response) => {
      // Check if the background script sent a response
      if (response) {
        // Clear the previous results
        searchResults.innerHTML = "";
        // Loop through the response array and append each item to the results div
        for (let item of response) {
          // Create a new div element for each item
          let resultDiv = document.createElement("div");
          // Set the innerHTML of the div element to the item title and url
          resultDiv.innerHTML = `<h4>${item.title}</h4><a href="${item.url}" target="_blank">${item.url}</a>`;
          // Append the div element to the results div
          searchResults.appendChild(resultDiv);
        }
      } else {
        // If no response, show an error message
        searchResults.innerHTML = "<p>Sorry, something went wrong.</p>";
      }
    });
  } else {
    // If the input is empty, show a warning message
    searchResults.innerHTML = "<p>Please enter a keyword.</p>";
  }
});