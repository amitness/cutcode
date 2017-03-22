// linking to Mousetrap js
var imported = document.createElement('script');
imported.src = 'mousetrap.js';
document.head.appendChild(imported);

 Mousetrap.bind('5', function() {
	 alert("5");
 });