//referenced formatting from @chenhunghan: https://github.com/HIIT/dime-webextension/blob/master/src/webextension/options.js#L15

function saveOptions(e) {
  e.preventDefault();
  

  console.log("saving options");
  
  browser.storage.local.set({
	color: document.getElementById('color').value,
	commenting: document.getElementById('commenting').value,
	attribution: document.getElementById('attribution').checked
  });
  document.getElementById('status').innerHTML = 'test';
  
  setTimeout(function(){
	  document.getElementById('status').innerHTML = '';
  }, 1000);
}

function restoreOptions() {
	console.log("page load");
	browser.storage.local.get(['color', 'attribution', 'commenting'], (items) => {
		const{color, attribution, commenting} = items;
		document.getElementById('color').value = color;
		document.getElementById('attribution').value = attribution;
		document.getElementById('commenting').value = commenting;
	});
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);