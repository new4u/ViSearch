// background.js
// Copy the tempermonkey code from the web page content
(function () {
    let button = document.createElement("button");
    button.innerHTML = "ViSearch";
    button.style.cssText =
      "position: fixed; top: 0; right: 0; z-index: 999; width: 100px; height: 50px; background-color: green; color: white; font-size: 20px;";
    // Add button to page
    document.body.appendChild(button);
    // Create graph element
    const graph = document.createElement("div");
    graph.style.position = "fixed";
    graph.style.top = "50px";
    graph.style.right = "0px";
    graph.style.width = "500px";
    graph.style.height = "500px";
    graph.style.background = "#fff";
    graph.style.border = "1px solid #ccc";
    graph.style.display = "none";
    graph.style.opacity = 0.9;
    // Add graph to page
    document.body.appendChild(graph);
    let graphVisible = false;
    // Toggle graph on button click
    button.addEventListener("click", () => {
      if (graphVisible) {
        graph.style.display = "none";
        graphVisible = false;
      } else {
        graph.style.display = "block";
        graphVisible = true;
        data = parseWebPage(searchtext);
        console.log("data", data);
        nodes = data.nodes;
        links = data.links;
        //remove the previous canvs
        d3.select("#graph-svg").remove();
        console.log("#graph-svg", d3.select("#graph-svg"));
        renderD3Graph(nodes, links, graph);
      }
    });
    // Hide graph on outside click
    document.addEventListener("click", (event) => {
      if (
        graphVisible &&
        event.target !== graph &&
        !graph.contains(event.target) &&
        event.target !== button
      ) {
        graph.style.display = "none";
        graphVisible = false;
      }
    });
  })();
  
  // Modify the code as needed
  // Use chrome.scripting API to inject foreground.js into target web page
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['foreground.js']
      })
      .then(() => {
        console.log('INJECTED FOREGROUND SCRIPT.');
      })
      .catch(err => console.log(err));
    }
  });