/**
 * Executed when the extension is invoked.
 * This will only do things the first time the extension is loaded up. 
 */
(function cutCode() {
  "use strict";
  // local variables
  /**
	 * Defines the default configurations
	 * @prop {Array} snippetHistory contains history of code snippets taken
	 * @prop {Number} numSnippets Defines maximum number of snippets
	 * @prop {Number} numChars Defines number of characters to be held for each snippet
	 */
  var defaults = {
    snippetHistory: [],
    numSnippets: 5,
    numChars: 500
  };

  // give the config object a special name to
  // prevent conflicts with other settings
  var configName = "cut$code";

  //-> end of local variables

  // main

  getConfig();
  setUpEvents("pre");

  //-> end of main

  // helper functions

  /**
	 * Gets and sets the config object saved in storage
	 * @param {Object} configName The name of the configuration object to retrieve
	 * @returns {Object} The configuration object
	 */
  function getConfig() {
    chrome.storage.local.get(configName, function(config) {
      if (!config) {
        config = defaults;
        chrome.storage.local.set({ configName: config });
      }

      return config;
    });
  }

  function setUpEvents(tagName) {
    var blocks = document.getElementsByTagName(tagName);
    elements.forEach(function(block) {
      // double clicked
      block.addEventListener("dblclick", function(event) {
        copyBlock(block);
        styleBlock(block);
      });
    });
  }

  function copyBlock(block) {
    // Select block of code
    var range = document.createRange();
    range.selectNode(block);

    try {
      window.getSelection().addRange(range);
      document.execCommand("copy");

      var config = getConfig(configName);
      addNewSnippet(range, config);

      // improves performance
	  range.detach();
		
    } catch (error) {}
  }

  function styleBlock(block) {
    block.style.outline = "2px solid #0D0";
    setTimeout(function() {
      return (block.style.outline = "none");
    }, 500);
  }

  function addNewSnippet(range, config) {
   
    if (config.snippetHistory.length >= config.numSnippets) {
      config.snippetHistory.pop();
    }

    //add this snippet as the most recent. Entry is controlled
    //by user options
    config.snippetHistory.unshift({
      snippet: range.toString().substring(0, Number(result.numChars)),
      URI: range.commonAncestorContainer.baseURI,
      date: new Date().toString()
    });
    chrome.storage.local.set({ configName: config });
  }

  //-> end of helper functions
})();
