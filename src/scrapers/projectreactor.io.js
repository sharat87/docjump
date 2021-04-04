export default {

	patterns: [
		/^https:\/\/projectreactor\.io\/docs/,
	],

	scraper() {
		const entries = []
		const methodDetailAnchor = document.querySelector("a[name='method.detail']")
		const methodAnchors = methodDetailAnchor.parentElement.querySelectorAll("a[name]")

		for (const anc of methodAnchors) {
			if (anc.name === "method.detail") {
				continue
			}

			if (anc.nextElementSibling == null) {
				continue
			}

			const signatureLabel = anc.nextElementSibling.querySelector("pre")
			if (signatureLabel == null) {
				continue
			}

			const text = signatureLabel.innerText
			const name = text.match(/\s([a-zA-Z0-9_]+)\(/)[1];

				entries.push({
					type: "method",
					hash: anc.name,
					text,
					name,
				})
		}

		return entries
	},

}
