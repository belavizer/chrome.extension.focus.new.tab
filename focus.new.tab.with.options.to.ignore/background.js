/**
 * Author: Bela Vizer
 */

/**
 * var shiftPressed = false;
 * 
 * chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
 * console.log("eventgeci");
 * 
 * switch (request.type) { case 'shiftPressed': shiftPressed = true;
 * 
 * console.log("shift pressed DOWN BACKGROUND job event captured");
 * 
 * break; case 'shiftkeyup': shiftPressed = false;
 * 
 * console.log("shift pressed UP BACKGROUND job event captured");
 * 
 * break; }
 * 
 * //return Promise.resolve("Dummy response to keep the console quiet"); return
 * true; });
 */

var ignoredPageString = "";
var ignoredPageArray;

chrome.storage.sync.get({
	focusNewTabIgnoredPageListConfig : ''
}, function(items) {
	// console.log("options: " + items.focusNewTabIgnoredPageListConfig);
	ignoredPageString = items.focusNewTabIgnoredPageListConfig;
	
	if (ignoredPageString != null) {
		ignoredPageArray = ignoredPageString.split("\n");
	}
	
}); // chrome.storage.sync.get



function tabWithoutSelecting(tab) {
	var shouldNotFocus = null;

	if (ignoredPageArray == null || ignoredPageArray.length == 0) {
		console.log("tabsInFrontRegex|tabWithoutSelecting: on option page it seems there is no page listed to ignore -> this tab must be in front then");

		selectTab(tab, shouldNotFocus);

		return;
	}
	
	for (let i = 0; i < ignoredPageArray.length; i++) {
		var currentPageRegexpToIgnore = ignoredPageArray[i];
		
		console.log("tabsInFrontRegex|tabWithoutSelecting - currentPageRegexpToIgnore: " + currentPageRegexpToIgnore);

		if (currentPageRegexpToIgnore == null || currentPageRegexpToIgnore.length == 0) {
			console.log("tabsInFrontRegex|tabWithoutSelecting - currentPageRegexpToIgnore was null or empty, focusing on the tab then");

			selectTab(tab, shouldNotFocus);
		}
		
		if (tab.pendingUrl.match(currentPageRegexpToIgnore) != null) {
			shouldNotFocus = "true";
			
			break;
		}
		
		shouldNotFocus = null;
	} // for loop
	
	selectTab(tab, shouldNotFocus)
}

function selectTab(tab, shouldNotFocus) {
		if (shouldNotFocus == null) {
		chrome.tabs.update(tab.id, {
			selected: true
			// highlighted: true
		});
	}
}

chrome.tabs.onCreated.addListener(tabWithoutSelecting);

chrome.storage.onChanged.addListener(function (changes, namespace) {
	  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
	    console.log(
	      `Storage key "${key}" in namespace "${namespace}" changed.`,
	      `Old value was "${oldValue}", new value is "${newValue}".`
	    );
	    
	    if (key === "focusNewTabIgnoredPageListConfig") {
	    	//console.log("YYYYYYYYYYYYYYYYYYYYY: " + key + " - oldValue: " + oldValue + " - newValue: " + newValue);
	    	ignoredPageString = newValue;
	    	
	    	if (ignoredPageString != null) {
	    		ignoredPageArray = ignoredPageString.split("\n");
	    	}
	    }
	  }
});


