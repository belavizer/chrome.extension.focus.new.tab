function save_options() {
	var ignoredPageList = document.getElementById('optionsregexptextarea').value;
	
	if (ignoredPageList != null) {
		ignoredPageList = ignoredPageList.trim();
	}

	chrome.storage.sync.set({
		focusNewTabIgnoredPageListConfig : ignoredPageList
	}, function() {
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';

		setTimeout(function() {
			status.textContent = '';
		}, 2000);
	});
}

function restore_options() {
	chrome.storage.sync.get({
		focusNewTabIgnoredPageListConfig : ''
	}, function(items) {
		document.getElementById('optionsregexptextarea').value = items.focusNewTabIgnoredPageListConfig;
	});
}


document.getElementById('save').addEventListener('click', save_options);
document.addEventListener('DOMContentLoaded', restore_options);