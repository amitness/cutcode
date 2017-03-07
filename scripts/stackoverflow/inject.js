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
			window.getSelection().removeAllRanges()
			block.style.border = '2px solid #0D0';
			setTimeout(function () {
			  return block.style.border = 'none';
			}, 1000);
		} catch (err) {
			console.log('Failed to copy', err);
		}
	});
});