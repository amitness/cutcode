//writes options selected by user to the Chrome remote (local) Storage API
function save_options(){
  var snippets = document.getElementById('snippets').value;
  var chars = document.getElementById('chars').value;
  var allowedString = document.getElementById('allowed-sites').value;

  if(snippets === ""){
    snippets = 5;
  }
  if(chars === ""){
    chars = 500;
  }
  if(allowedString === ""){
    allowedString = "stackoverflow.com";
  }

  //getting an array with the websites the user allows. Only addresses with a dot 
  //or just a dot alone are valid inputs. Everything else is discarded.
  var allowedArray = allowedString.replace(/ /g,'').split(',').filter(function(value) {
    return value.match(/(.*\..*)|\./);
  });

  chrome.storage.local.set({
    numSnippets: snippets,
    numChars: chars,
    allowedSites: allowedArray
  }, function(){
    document.getElementById("status").innerText = "Saved";
    setTimeout(function(){
      document.getElementById("status").innerText = "";
    }, 750);
  });
}

//updates DOM with user Selected options. This function is called whenever the
//remote storage is updated
function updateOptionsValues(){

  var numSnippets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
  var numChars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  var allowedSites = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['stackoverflow.com'];

  document.getElementById('snippets').value = numSnippets;
  document.getElementById('chars').value = numChars;

  var allowedString = "";
  for(var i = 0; i < allowedSites.length; i++) {
   if(i === 0) {
     allowedString += allowedSites[i];
   }
   else {
     allowedString += ', ' + allowedSites[i]; 
   }
  }
  document.getElementById('allowed-sites').value = allowedString;
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
  var newAllowedSites;

  if(changes.numSnippets){
    newSnippetsNumber = changes.numSnippets.newValue;
  }
  if(changes.numChars){
    newCharsNumber = changes.numChars.newValue;
  }
  if(changes.allowedSites){
    newAllowedSites = changes.allowedSites.newValue;
  }

  updateOptionsValues(newSnippetsNumber, newCharsNumber, newAllowedSites);

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
chrome.storage.local.get(null, function(result){
  updateOptionsValues(result.numSnippets, result.numChars, result.allowedSites);
  if(!result.snippetHistory){
    chrome.storage.local.set({snippetHistory: []});
  }
});

//draws the table with live Snippet History info whenever the options
//modal or page is opened
window.onload = function(){
  table = document.createElement("table");
  table.className = "snippet-history";
  table.innerHTML = '<tr>\n                      <th>Code Snippet</th>\n                      <th>URL</th>\n                      <th>Date</th>\n                    </tr>';
  document.querySelector("body").appendChild(table);
  chrome.storage.local.get("snippetHistory", function(result){
    snipArray = result.snippetHistory;
    console.log(snipArray);
    for(var i=0; i<snipArray.length; i++){
      updateSnippetHistory(snipArray[i]);
    }
  });
};