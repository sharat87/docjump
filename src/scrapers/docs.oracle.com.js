export default {

	globs: [
		"https://docs.oracle.com/*",
	],

	scraper() {
		const match = window.location.toString().match(/^https:\/\/docs\.oracle\.com\/\w+\/java\/javase\/(\d+)\/docs/)

		if (!match) {
			return []
		}

		const entries = []
		const selectors = [
			"a[id='constructor.detail']",
			"a[id='field.detail']",
			"a[id='method.detail']",
			"a[name='constructor.detail']",
			"a[name='field.detail']",
			"a[name='method.detail']",
		]

		for (const methodDetailAnchor of document.querySelectorAll(selectors.join(","))) {
			const methodAnchors = methodDetailAnchor.parentElement.querySelectorAll("a[id], a[name]")
			const type = (methodDetailAnchor.id || methodDetailAnchor.name).split(".")[0]

			for (const anc of methodAnchors) {
				const hash = anc.getAttribute("id") || anc.getAttribute("name")
				if (hash === "method.detail") {
					continue
				}

				let name;
				let signatureLabel;
				if (match[1] > 12) {
					signatureLabel = anc.parentElement.nextElementSibling
					const nameMatch = signatureLabel.innerText.match(/([a-zA-Z0-9_]+)\u200B?\(/)
						name = nameMatch == null ? signatureLabel.innerText : nameMatch[1]
					} else {
						if (anc.nextElementSibling == null) {
							continue
						}
						signatureLabel = anc.nextElementSibling.querySelector("pre")
						name = signatureLabel == null ? "" : anc.nextElementSibling.querySelector("h4").innerText
					}

				if (signatureLabel == null) {
					continue
				}

				entries.push({
					type,
					hash,
					text: signatureLabel.innerText,
					name,
				})
			}
		}

		return entries
	},

}
