'use strict';

Array.from(document.getElementsByTagName('pre'))// get all code snippets
.forEach(function (block) {
	
	block.addEventListener('dblclick', function (event) {
		// Reference: http://stackoverflow.com/a/6462980/3485241
		
		// Save original text to restore later
		var originalText = block.innerText;

		block.innerText = stripPrompt(block.innerText);

		// Add snippet to range
		var range = document.createRange();
		range.selectNode(block);

		// Copy snippet to clipboard
		try {
			window.getSelection().addRange(range);
			document.execCommand('copy');
			window.getSelection().removeAllRanges();

			block.style.border = '2px solid #0D0';

			// Restore the block to original state
			setTimeout(function () {
				block.style.border = 'none';
				block.innerText = originalText;
			}, 500);

		} catch (err) {
			console.log('Failed to copy', err);
		}
	});
});

/* Strip out >>> from code snippet of prompt */
function stripPrompt(code) {
	var lines = code.split('\n');
	var strippedCode = '';

	// Consider the block as prompt shell if the first
	// line starts with >>>
	if (lines[0].slice(0, 3) !== '>>>') {
		return code;
	}

	lines.forEach(function (line) {
		if (line.slice(0, 3) === '>>>') {
			strippedCode += line.slice(3).trim() + '\n';
		}
	});

	return strippedCode;
}
