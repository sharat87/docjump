export default {

	globs: [
		"https://codemirror.net/doc/manual.html",
	],

	scraper() {
		const entries = []

		for (const item of document.querySelectorAll("dt[id]")) {
			const hash = item.id

			if (hash.startsWith("option_")) {
				entries.push({
					hash,
					name: item.innerText.substr("option_".length),
					text: "option",
				})

			} else if (hash.startsWith("event_")) {
				entries.push({
					hash,
					name: item.innerText,
					text: "event",
				})

			} else if (hash.startsWith("command_")) {
				entries.push({
					hash,
					name: item.innerText,
					text: "command",
				})

			} else if (hash.startsWith("class_")) {
				entries.push({
					hash,
					name: item.innerText,
					text: "CSS-class",
				})

			} else if (hash.startsWith("addon_")) {
				entries.push({
					hash,
					name: item.innerText,
					text: "addon",
				})

			} else if (hash.startsWith("vimapi_")) {
				entries.push({
					hash,
					name: item.innerText,
					text: "addon",
				})

			} else {
				entries.push({
					hash,
					name: item.innerText,
					text: "API",
				})

			}
		}

		entries.push({
			hash: "api_constructor",
			name: "Constructor",
			text: "API",
		})

		entries.push({
			hash: "modeapi",
			name: "Writing CodeMirror Modes",
			text: "API",
		})

		return entries
	},

}
