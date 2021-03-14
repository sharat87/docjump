import Scrapers from "./scrapers/index"

Scrapers.define(
	[
		/^https:\/\/docs\.oracle\.com\/\w+\/java\/javase\/(\d+)\/docs/,
		/^https:\/\/docs\.spring\.io\/spring-data\/data-mongodb\/docs/,
	],
	(match) => {
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
							console.warn("No next sibling for", anc)
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
)

Scrapers.define(/^https:\/\/projectreactor\.io\/docs/, () => {
	const entries = []
	const methodDetailAnchor = document.querySelector("a[name='method.detail']")
	const methodAnchors = methodDetailAnchor.parentElement.querySelectorAll("a[name]")

	for (const anc of methodAnchors) {
		if (anc.name === "method.detail") {
			continue
		}

		if (anc.nextElementSibling == null) {
			console.warn("No next sibling for", anc)
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
})

Scrapers.define(/^https:\/\/docs\.python\.org\/3\/library/, () => {
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
})

Scrapers.define(/^https:\/\/docs\.docker\.com/, () => {
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
})

Scrapers.define(/^https:\/\/jestjs\.io\/docs/, () => {
	console.log("jest scraper")
	const entries = []

	for (const header of document.querySelector(".docsContainer").querySelectorAll("h2, h3")) {
		console.log("header", header)
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
})

try {
	showJumper()
} catch (e) {
	console.error("Error showing jumper", e)
}

function makeRoot() {
	const root = document.createElement("div")
	root.classList.add("b")

	const searchInput = document.createElement("input")
	searchInput.type = "search"
	searchInput.placeholder = "Type to filter, Esc to close."
	root.appendChild(searchInput)

	const resultsBox = document.createElement("div")
	resultsBox.classList.add("r")
	root.appendChild(resultsBox)

	const style = document.createElement("style")
	style.innerText = `
	:placeholder-shown { font-style: italic; }
	.b {
	  position: fixed;
	  top: 1rem;
	  left: 50vw;
	  transform: translateX(-50%);
	  width: 60ch;
	  max-height: 70vh;
	  display: flex;
	  flex-direction: column;
	  font-family: monospace;
	  font-size: 18px;
	  background-color: #FFF;
	  color: #111;
	  box-shadow: 0 0 24px #0009;
	  z-index: 9999;
	}
	input { color: inherit; background-color: transparent; font: inherit; border: none; width: 100%; padding: 6px; }
	.r { overflow-y: auto; }
	.r a { display: block; text-decoration: none; padding: 3px 6px; color: inherit; }
	.r a .t { font-size: .8em; }
	.r a .type { opacity: .5; font-style: italic; font-size: .6em; margin-left: 2ch; }
	.r a:hover { background-color: #CEF; }
	.r a.active { background-color: #09F; color: #EEF; }
	.r .hl { color: orange; }
	`
	root.appendChild(style)

	return root
}

function showJumper() {
	const entries = []

	for (const {patterns, scraper} of Scrapers.getAll()) {
		for (const re of patterns) {
			const match = window.location.toString().match(re)
			if (match) {
				entries.push(...scraper(match))
				break
			}
		}
	}

	const prevRoot = document.getElementById("docjump")
	if (prevRoot != null) {
		prevRoot.remove()
	}

	if (entries.length === 0) {
		// TODO: Offer to report this URL for not producing any jump targets.
		alert("No jump targets found.")
		return
	}

	const container = document.createElement("div")
	container.id = "docjump"
	container.style.zIndex = Math.pow(10, 7)  // Needed to beat the cookie consent popup on `docs.oracle.com`.
	container.style.position = "relative"
	document.body.appendChild(container)

	const root = makeRoot()
	const shadow = container.attachShadow({mode: "open"})
	shadow.appendChild(root)

	const resultsBox = root.querySelector(".r")

	on(root, "input", event => {
		const needle = event.target.value.trim().toLowerCase()
		resultsBox.innerHTML = ""

		if (needle === "") {
			return
		}

		const results = []

		for (const entry of entries) {
			const result = fuzzyFind(entry.name, needle);
			if (result != null) {
				results.push([entry, result])
			}
		}

		results.sort((r1, r2) => r1[1].weight - r2[1].weight)

		for (const [entry, result] of results) {
			const anchor = document.createElement("a")
			anchor.setAttribute("href", "#" + entry.hash)

			const titleEl = document.createElement("div")
			titleEl.innerText = (entry.preName || "") + entry.name
			// let name = entry.name
			// for (const i of result.indices) {
			// 	name = name.substr(0, i) + "<span class=hl>" + name[i] + "</span>" + name.substr(i + 1)
			// }
			const typeEl = document.createElement("span")
			typeEl.classList.add("type")
			titleEl.appendChild(typeEl)
			anchor.appendChild(titleEl)

			const subtitleEl = document.createElement("div")
			subtitleEl.classList.add("t")
			subtitleEl.innerText = entry.text
			anchor.appendChild(subtitleEl)

			resultsBox.appendChild(anchor)
		}

		if (resultsBox.childElementCount > 0) {
			resultsBox.firstElementChild.classList.add("active")
		} else {
			resultsBox.innerHTML = "<em>Nothing found.</em>"
		}
	})

	on(root, "click", event => {
		if (event.target.tagName === "A") {
			container.remove()
		}
	})

	on(root, "keydown", event => {
		if (event.key === "Escape") {
			if (event.target.value.trim() !== "") {
				event.target.value = ""
				resultsBox.innerHTML = ""
			} else {
				container.remove()
			}
		} else if (event.key === "ArrowDown" || (event.key === "n" && event.ctrlKey)) {
			const currentActive = resultsBox.querySelector(".active")
			if (currentActive != null && currentActive.nextElementSibling != null) {
				currentActive.classList.remove("active")
				currentActive.nextElementSibling.classList.add("active")
				currentActive.nextElementSibling.scrollIntoView(false)
			}
			event.preventDefault()
		} else if (event.key === "ArrowUp" || (event.key === "p" && event.ctrlKey)) {
			const currentActive = resultsBox.querySelector(".active")
			if (currentActive != null && currentActive.previousElementSibling != null) {
				currentActive.classList.remove("active")
				currentActive.previousElementSibling.classList.add("active")
				currentActive.previousElementSibling.scrollIntoView(false)
			}
			event.preventDefault()
		} else if (event.key === "Enter") {
			const currentActive = resultsBox.querySelector(".active")
			if (currentActive != null) {
				currentActive.click()
				event.preventDefault()
			}
		}
	})

	root.querySelector("input").focus()
}

function fuzzyFind(haystack, needle) {
	// Higher the weight, the lower it goes in the results.
	let weight = 0
	const indices = []
	let needleIndex = 0

	for (let haystackIndex = 0; haystackIndex < haystack.length && needleIndex < needle.length; ++haystackIndex) {
		const hay = haystack[haystackIndex],
			lowerHay = hay.toLowerCase(),
			prevHay = hay[haystackIndex - 1]
		if (lowerHay === needle[needleIndex]) {
			weight +=
				haystackIndex // The farther in the haystack the match is, the heavier the result gets.
				+ 1  // So that zero index match gets a non-zero weight.
				+ (hay === lowerHay ? 1 : 0)  // Uppercase match indicates camel casing, which should be lighter.
				+ (prevHay === "_" ? 0 : 1)  // Prev char is underscore indicates snake casing, which should be lighter.
			++needleIndex
			indices.unshift(haystackIndex)
		}
	}

	return needleIndex < needle.length ? null : {weight, indices}
}

function on(emitter, eventName, listener) {
	emitter.addEventListener(eventName, event => {
		try {
			return listener.call(this, event)
		} catch (e) {
			console.error(`Error in ${eventName} listener for ${emitter}`, e)
		}
	})
}
