'use strict';

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

		// Add snippet to range
		var range = document.createRange();
		range.selectNode(block);


		// Copy snippet to clipboard
		try {
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
			block.style.outline = '2px solid #0D0';
			setTimeout(function () {
			  return block.style.outline = 'none';
			}, 500);
		} catch (err) {
			console.log('Failed to copy', err);
		}
	});
});
