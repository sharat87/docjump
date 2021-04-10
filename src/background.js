if (process.env.BROWSER === "chrome") {
	window.browser = chrome;
}

browser.pageAction.onClicked.addListener(tab => {
	browser.tabs.executeScript(tab.id, {
		file: "/content_script.js",
	})
})

if (process.env.BROWSER === "chrome") {
	const manifest = chrome.runtime.getManifest();

	const rules = manifest.permissions
		.filter(perm => perm.startsWith("http://") || perm.startsWith("https://"))
		.map(pat => pat.replace(/\*/g, ".*"))
		.map(pat => ({
			conditions: [
				new chrome.declarativeContent.PageStateMatcher({
					pageUrl: { originAndPathMatches: pat },
				}),
			],
			actions: [
				new chrome.declarativeContent.ShowPageAction(),
			],
		}));

	chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
		chrome.declarativeContent.onPageChanged.addRules(rules);
	});
}
