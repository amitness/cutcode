'use strict';

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
			chrome.storage.sync.get("snippetHistory", function(result){
				console.log(result.snippetHistory);
				result.snippetHistory.unshift({
					snippet: range.toString(),
				  URI: range.commonAncestorContainer.baseURI,
					date: Date.now()
				});
				chrome.storage.sync.set({snippetHistory: result.snippetHistory});
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
