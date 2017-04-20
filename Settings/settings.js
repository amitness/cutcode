//writes options selected by user to the Chrome remote (sync) Storage API
function save_options(){
  var snippets = document.getElementById('snippets').value;
  var chars = document.getElementById('chars').value;

  if(snippets === ""){
    snippets = 5;
  }
  if(chars ===""){
    chars = 500;
  }
  chrome.storage.sync.set({
    numSnippets: snippets,
    numChars: chars
  }, function(){
    document.getElementById("status").innerText = "Saved";
    setTimeout(function(){
      document.getElementById("status").innerText = "";
    }, 750);
  });
}

//updates DOM with user Selected options. This function is called whenever the
//remote storage is updated
function updateOptionsValues(numSnippets=5, numChars=500){

  document.getElementById('snippets').value = numSnippets;
  document.getElementById('chars').value = numChars;
}

//helper function to update the DOM with our history of snippets whenever
//the Options modal/tab is opened
function updateSnippetHistory(snippetObject){
  entry = document.createElement("tr");
  entry.innerHTML = "<td>"+"</td>"
                     +"<td>" +snippetObject.URI + "</td>"
                     +"<td>" + snippetObject.date + "</td>";
  entry.firstChild.innerText = snippetObject.snippet;
  document.querySelector(".snippet-history").appendChild(entry);
}

//when the remote storage object is updated, this function is fired
//it will then call updateOptionsValues in order to update the DOM
chrome.storage.onChanged.addListener(function(changes, namespace){
  var newSnippetsNumber;
  var newCharsNumber;

  if(changes.numSnippets){
    newSnippetsNumber = changes.numSnippets.newValue;
  }
  if(changes.numChars){
    newCharsNumber = changes.numChars.newValue;
  }
  updateOptionsValues(newSnippetsNumber, newCharsNumber);

});


//saves options when the form is submitted
document.querySelector('form').addEventListener('submit', function(event){
  event.preventDefault();
  save_options();
});

//open options in a separate page when the link is clicked
document.getElementById('options_link').addEventListener('click', function(){
    window.close();
    chrome.runtime.openOptionsPage();
    });

//this function is called to set up the default options when options is opened. On the very first pass,
//all three options will be null, so they are set here. The DOM will be updated
//by updateOptionsValues
chrome.storage.sync.get(null, function(result){
  updateOptionsValues(result.numSnippets, result.numChars);
  if(!result.snippetHistory){
    chrome.storage.sync.set({snippetHistory: []});
  }
});

//draws the table with live Snippet History info whenever the options
//modal or page is opened
window.onload = function(){
  table = document.createElement("table")
  table.className = "snippet-history"
  table.innerHTML = `<tr>
                      <th>Code Snippet</th>
                      <th>URL</th>
                      <th>Date</th>
                    </tr>`;
  document.querySelector("body").appendChild(table);
  chrome.storage.sync.get("snippetHistory", function(result){
    snipArray = result.snippetHistory;
    console.log(snipArray);
    for(var i=0; i<snipArray.length; i++){
      updateSnippetHistory(snipArray[i]);
    }
  })
}
