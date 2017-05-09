'use strict';
var color = '',
attribution = false,
commenting = '',
codeAttribution = '',
hotkey = '';

function onError(error) {
  console.log(`Error: ${error}`);
}

function onGot(item) {
	if (item.color){ //is color set
		color = item.color;
	}
	else{
		color = '#0D0';
	}
	if (item.attribution){ //is attribution checked
		attribution = true;
		if (item.commenting){ //is commenting set
			commenting = item.commenting;
		}
	}
}
function isNotChrome(){
	return typeof browser !== typeof undefined ? true : false;
}

 
 
if (isNotChrome){
	chrome.storage.local.get(null, onGot);
}
else{
	var getting = browser.storage.local.get();
	getting.then(onGot, onError);
}



//Executed when the extension is invoked. This will only do things
//the first time the extension is loaded up. It sets up
//default values for our options and initializes snippetHistory
//to an empty array
chrome.storage.local.get(null, function(result){
  if(!result.snippetHistory){
    chrome.storage.local.set({snippetHistory: []});
  }
	if(!result.numSnippets){
    chrome.storage.local.set({numSnippets: 5});
  }
	if(!result.numChars){
    chrome.storage.local.set({numChars: 500});
  }
});

Array.from(document.getElementsByTagName('pre')) // get all code snippets
.forEach(function (block) {
	block.addEventListener('dblclick', function (event) {
		// Reference: http://stackoverflow.com/a/6462980/3485241
		console.log(commenting);
		//gets the address of the current page
		if (attribution){
			codeAttribution = commenting + ' source: ' + window.location.toString()+'<br/>';
		}
		var copyText = block.innerHTML;
		
		copyText = codeAttribution+ copyText;
		//copy old HTML
		var oldHTML = block.innerHTML;
		
		//replace with new HTML
		block.innerHTML = copyText;
		
		// Add snippet to range
		var range = document.createRange();
		range.selectNode(block);
		// Copy snippet to clipboard
		try {
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range);
			document.execCommand('copy');
			chrome.storage.local.get(null, function(result){
				console.log(result);
				//if grabbing this snippet results in exceeding the
				//specified number, pop off the oldes one
				if(result.snippetHistory.length >= result.numSnippets){
					result.snippetHistory.pop();
				}

				//add this snippet as the most recent. Entry is controlled
				//by user options
				result.snippetHistory.unshift({
					snippet: range.toString().substring(0, Number(result.numChars)),
				  URI: range.commonAncestorContainer.baseURI,
					date: new Date().toString()
				});
				chrome.storage.local.set({snippetHistory: result.snippetHistory});
			});

			window.getSelection().removeAllRanges();
		
			//replace new with old HTML
			block.innerHTML = oldHTML;
			block.style.border = '2px solid '+color;
			setTimeout(function () {
			  return block.style.outline = 'none';
			}, 500);
		} catch (err) {
			console.log('Failed to copy', err);
		}
	});
});