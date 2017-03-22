// linking to Mousetrap js
var imported = document.createElement('script');
imported.src = 'mousetrap.js';
document.head.appendChild(imported);

 Mousetrap.bind('4', function() {
	 alert("4");
 });