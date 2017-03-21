//referenced formatting from @chenhunghan: https://github.com/HIIT/dime-webextension/blob/master/src/webextension/options.js#L15

function saveOptions(e) {
  e.preventDefault();
  
  
if (isNotChrome){
	browser = chrome;
}
  
  
  browser.storage.local.set({
	color: document.getElementById('color').value,
	commenting: document.getElementById('commenting').value,
	attribution: document.getElementById('attribution').checked
  });
  document.getElementById('status').innerHTML = 'Saved!';
  
  setTimeout(function(){
	  document.getElementById('status').innerHTML = '';
  }, 1000);
}

function restoreOptions() {
	if (isNotChrome){
		chrome.storage.local.get(null, function(item){
			document.getElementById('color').value = item.color || '#0D0';
			document.getElementById('attribution').checked = item.attribution || false;
			document.getElementById('commenting').value = item.commenting || '';	
		});
	}//handle firefox
	else{
			browser.storage.local.get(['color', 'attribution', 'commenting'], (items) => {
		const{color, attribution, commenting, hotkey} = items;
		document.getElementById('color').value = color ||'#0D0';
		document.getElementById('attribution').checked = attribution || false;
		document.getElementById('commenting').value = commenting || '';
		});

	};
}

//checks if browser is defined. if not, current browser is probably Chrome or other.
function isNotChrome() {
	return typeof browser !== typeof undefined ? true : false;
}


document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);