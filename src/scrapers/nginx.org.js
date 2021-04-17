export default {

	globs: [
		"http://nginx.org/*",
	],

	scraper() {
		const entries = []

		for (const directive of document.querySelectorAll("#content a[name] + .directive")) {
			const anchor = directive.previousElementSibling

			const syntaxCode = directive.querySelector("code")

			let title = syntaxCode.firstElementChild.innerText
			let type = syntaxCode.innerText.replace(title, "").trim()

			entries.push({
				hash: anchor.name,
				name: title,
				text: type,
			})
		}

		return entries
	},

}
