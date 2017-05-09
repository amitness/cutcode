'use strict';

// if the URL is an acceptable website
if(document.URL.indexOf("stackoverflow.com") >= 0 || 
   document.URL.indexOf("stackexchange.com") >= 0 ||
   document.URL.indexOf("github.com") >= 0){ 

Array.from(document.getElementsByTagName('pre')) // get all code snippets
.forEach(function (block) {
	
	block.addEventListener('dblclick', function (event) {
		// Reference: http://stackoverflow.com/a/6462980/3485241
		
		// Add snippet to range
		var range = document.createRange();
		range.selectNode(block);

		// Copy snippet to clipboard
		try {
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range);
			document.execCommand('copy');
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


}


