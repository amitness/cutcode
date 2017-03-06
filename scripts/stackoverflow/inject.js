'use strict';

Array.from(document.getElementsByTagName('pre')) // get all code snippets
.forEach(function (block) {
	block.addEventListener('dblclick', function (event) {
		event.preventDefault();
		event.stopPropagation();
		
		// Add snippet to range
		var range = document.createRange();
		range.selectNode(block);

		// Copy snippet to clipboard
		try {
			window.getSelection().addRange(range);
			document.execCommand('copy');
			block.innerText = '';
			window.getSelection().removeAllRanges()
		} catch (err) {
			console.log('Failed to copy', err);
		}
	});
});