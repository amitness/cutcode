'use strict';

Array.from(document.getElementsByTagName('pre')) // get all code snippets
.forEach(function (block) {
	
	block.addEventListener('dblclick', function (event) {
		// Reference: http://stackoverflow.com/a/6462980/3485241
		
		// Add snippet to range
		var range = document.createRange();
		range.selectNode(block);

		// current URL
		var tabURL = window.location.href;
		// page title
		var tabTitle = document.title;
		// this will eventually be commented
		var copyThis = new Array;


		// Copy snippet to clipboard
		try {
			window.getSelection().addRange(range);
			document.execCommand('copy');
			window.getSelection().removeAllRanges();


			// if user is on stackoverflow or stackexchange
			if ((tabURL.indexOf('stackoverflow.com') > -1) || (tabURL.indexOf('stackexchange.com') > -1)) { 
				// get the tags on the page and add to array
				var tagList = document.querySelector('.post-taglist').textContent.trim();
				// var tags = new Array;
				var tags = tagList.split(' ');

				for (var i = 0; i < tags.length; i++) {
					if (tags[i] === 'javascript') {
						copyThis.push('// Reference: ' + tabTitle);
						copyThis.push('// URL: ' + tabURL);
						break;
					}
				}

			}

			copyThis.push('');
			copyThis.push(range);

			// log what is to be copied
			// todo: figure our how to copy instead
			for (var i = 0; i < copyThis.length; ++i) {
  				console.log(copyThis[i] + ']');
			}


			block.style.border = '2px solid #0D0';
			setTimeout(function () {
			  return block.style.border = 'none';
			}, 500);
		} catch (err) {
			console.log('Failed to copy', err);
		}
	});
});