export default {

	globs: [
		"https://jestjs.io/docs/*",
	],

	scraper() {
		const entries = []

		for (const header of document.querySelector(".docsContainer").querySelectorAll("h2, h3")) {
			const titleCodeEl = header.querySelector("code")

			let title = ""
			let text = ""

			if (titleCodeEl == null) {
				title = header.textContent
			} else {
				title = titleCodeEl.textContent
				text = (titleCodeEl.nextSibling.textContent || "")
			}

			entries.push({
				hash: header.querySelector("a[id]").id,
				name: title,
				text: text,
			})
		}

		return entries
	},

}
