export default {

	patterns: [
		/^https:\/\/golang\.org\/pkg/,
	],

	scraper() {
		const entries = []

		for (const permalink of document.querySelectorAll("a.permalink")) {
			let title = ""
			let type = ""

			if (permalink.previousElementSibling != null) {
				title = permalink.previousElementSibling.innerText.trim()
				type = permalink.previousElementSibling.previousSibling.textContent
			} else {
				title = permalink.previousSibling.textContent.trim()
			}

			entries.push({
				hash: permalink.parentElement.id,
				name: title,
				text: type,
			})
		}

		return entries
	},

}
