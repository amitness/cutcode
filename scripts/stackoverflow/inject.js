'use strict';


Array.from(document.getElementsByTagName('pre')) // get all code snippets
.forEach(function (block) {
	
	block.addEventListener('dblclick', function (event) {
		// Reference: http://stackoverflow.com/a/6462980/3485241
		
		//gets the address of the current page
		var codeAttribution = '<br/><br/> source: ' + window.location.toString(),
		copyText = block.innerHTML;
		
		copyText = copyText + codeAttribution;
		//copy old HTML
		var oldHTML = block.innerHTML;
		
		//replace with new HTML
		block.innerHTML = copyText;
		
		// Add snippet to range
		var range = document.createRange();
		range.selectNode(block);
		
		
		// Copy snippet to clipboard
		try {
			window.getSelection().addRange(range);
			document.execCommand('copy');
			window.getSelection().removeAllRanges();
			
			//replace new with old HTML
			block.innerHTML = oldHTML;
			block.style.border = '2px solid #0D0';
			setTimeout(function () {
			  return block.style.border = 'none';
			}, 500);
		} catch (err) {
			console.log('Failed to copy', err);
		}
	});
});
