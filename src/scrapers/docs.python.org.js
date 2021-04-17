export default {

	scraper() {
		const entries = []

		for (const dl of document.querySelectorAll("dl.function, dl.method, dl.exception")) {
			const dt = dl.firstElementChild
			const type = dl.className

			let preName = ""
			if (dt.querySelector(".sig-prename")) {
				preName = dt.querySelector(".sig-prename").innerText
			} else if (type === "method" && dl.parentElement.parentElement.matches("dl.class")) {
				// This happens for the `logging` module.
				preName = dl.parentElement.previousElementSibling.id + "."
			}

			entries.push({
				type,
				hash: dt.id,
				text: dt.innerText,
				name: dt.querySelector(".sig-name").innerText,
				preName,
			})
		}

		return entries
	},

}
