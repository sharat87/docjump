export default {

	patterns: [
		/^https:\/\/nodejs\.org\/api/,
	],

	scraper() {
		const entries = []

		for (const mark of document.getElementById("apicontent").querySelectorAll("a.mark")) {
			const titleEl = mark.parentElement.previousElementSibling

			if (titleEl == null || titleEl.tagName !== "CODE") {
				continue
			}

			entries.push({
				hash: mark.id,
				name: titleEl.innerText,
			})
		}

		return entries
	},

}
