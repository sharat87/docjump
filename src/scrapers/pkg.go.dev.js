export default {

	scraper() {
		const entries = []

		for (const permalink of document.querySelectorAll("#nav-group-functions a, #nav-group-types a")) {
			let title = permalink.innerText.trim()
			let type = ""

			const closestUl = permalink.closest("#nav-group-functions, #nav-group-types")

			if (closestUl.id === "nav-group-functions") {
				type = "func"
			} else if (closestUl.id === "nav-group-types") {
				type = "type"
				if (title.startsWith("type ")) {
					title = title.substr("type ".length)
				}
			}

			entries.push({
				hash: permalink.getAttribute("href").substr(1),
				name: title,
				text: type,
			})
		}

		return entries
	},

}
