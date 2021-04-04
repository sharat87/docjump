export default {

	patterns: [
		/^https:\/\/docs\.docker\.com/,
	],

	scraper() {
		const entries = []

		let currentH2 = ""
		let currentH3 = ""

		for (const header of document.querySelectorAll("h2, h3, h4")) {
			const title = header.firstChild.textContent

			if (header.tagName === "H2") {
				currentH2 = title
				currentH3 = ""
			} else if (header.tagName === "H3") {
				currentH3 = title
			}

			const anchor = header.querySelector("a")
			if (anchor == null) {
				continue
			}

			let text = ""
			if (header.tagName === "H4") {
				text = currentH2 + (currentH2 && currentH3 ? " &rarr; " : "") + currentH3
			} else if (header.tagName === "h3") {
				text = currentH2
			}

			entries.push({
				hash: header.id,
				name: title,
				text: currentH2 + " &rarr; " + currentH3,
			})
		}

		return entries
	},

}
