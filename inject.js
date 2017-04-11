'use strict';

Array.from(document.getElementsByTagName('pre')) // get all code snippets
.forEach(function (block) {
	
	block.addEventListener('dblclick', function (event) {
		// Reference: http://stackoverflow.com/a/6462980/3485241
		var origlines = block.innerHTML
		console.log(origlines)
//get the code
var lines = block.getElementsByClassName('pun')
//save the original code for restoring 

//loop over the code , replace all the >>> with ' '
var arrayLength = lines.length;
for (var i = 0; i < arrayLength; i++) {
	

    if(lines[i].innerHTML == "&gt;&gt;&gt;"){

		lines[i].innerHTML = " "
	} 
    
}

		// Add snippet to range
		var range = document.createRange();
		range.selectNode(block);
        
		// Copy snippet to clipboard
		try {
			window.getSelection().addRange(range);
			document.execCommand('copy');



			window.getSelection().removeAllRanges();
			block.style.outline = '2px solid #0D0';
			setTimeout(function () {
			  return block.style.outline = 'none';
			}, 500);
			//set the text back to its original state
            block.innerHTML = origlines

		} catch (err) {
			console.log('Failed to copy', err);
		}
	});
});
