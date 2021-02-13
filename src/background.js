(window.browser || window.chrome).pageAction.onClicked.addListener(tab => {
	browser.tabs.executeScript(tab.id, {
		file: "/docJump.js",
	})
})
