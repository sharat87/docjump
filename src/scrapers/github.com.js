export default {

	globs: [
		"https://github.com/*/pull/*/files",
	],

	scraper() {
		const loc = location.toString()

		if (loc.match(/\/pull\/\d+\/files$/)) {
			return pullRequestFilesScraper()
		}

		return []
	},

}

function pullRequestFilesScraper() {
	const entries = []

	for (const fileEl of document.querySelectorAll("#files .file")) {
		const path = fileEl.firstElementChild.dataset.path
		const filename = path.match(/[^\/]+$/)[0]
		const dirMatch = path.match(/.*\//)
		const dirname = dirMatch == null ? "" : dirMatch[0]
		entries.push({
			hash: fileEl.id,
			name: filename,
			text: dirname,
		})
	}

	return entries
}
