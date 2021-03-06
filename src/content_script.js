// Glob modules in ParcelJS: <https://parceljs.org/module_resolution.html#glob-file-paths>.
import scraperModules from "./scrapers/*.js"

/*
This `scraperModules` object looks like:
{
	module1: {
		__esModule: true,
		default: {
			globs: ...,
			scraper: ...,
		},
	},
	module2: {
		__esModule: true,
		default: {
			globs: ...,
			scraper: ...,
		},
	}
}
*/

const CSS = `
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
		text-align: left;
		background-color: #fff;
		color: #111;
		box-shadow: 0 0 36px #000A;
		border-radius: 3px;
		overflow: hidden;
		z-index: 9999;
	}
	input {
		color: inherit;
		background-color: transparent;
		font: inherit;
		border: none;
		border-bottom: 1px solid currentColor;
		width: 100%;
		padding: 6px;
		line-height: 1.7;
		opacity: .6;
	}
	input:focus { outline: none; opacity: 1; }
	.r { overflow-y: auto; }
	.r a {
		display: block;
		text-decoration: none;
		padding: 3px 6px;
		color: inherit;
		transition: background-color .05s ease-out, color .05s ease-out;
	}
	.r a .t { font-size: .8em; }
	.r a .type { opacity: .5; font-style: italic; font-size: .6em; margin-left: 2ch; }
	.r a:hover { background-color: #CEF; }
	.r a.active { background-color: #09F; color: #EEF; }
	.r .hl { color: orange; }
	@media (prefers-color-scheme: dark) {
		.b {
			background-color: #222;
			color: #eee;
		}
		.r a:hover {
			background-color: #111;
			color: #fff;
		}
	}
`

try {
	showJumper()
} catch (e) {
	console.error("Error showing jumper", e)
}

function makeRoot() {
	// We create the whole markup using DOM APIs because inserting direct HTML makes Firefox Addons server's auto
	// linting system flare up.

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
	style.innerText = CSS
	root.appendChild(style)

	return root
}

function locationMatch(pattern) {
	return window.location.toString().match(pattern)
}

function showJumper() {
	const entries = scraperModules[location.hostname].default.scraper()

	const prevRoot = document.getElementById("docjump")
	if (prevRoot != null) {
		prevRoot.remove()
	}

	if (entries.length === 0) {
		alert("No jump targets found." +
			" Please report this URL at https://github.com/sharat87/docjump/issues/new. Thank you!")
		return
	}

	const container = document.createElement("div")
	container.id = "docjump"
	container.style.zIndex = Math.pow(10, 7)  // Needed to beat the cookie consent popup on `docs.oracle.com`.
	container.style.position = "relative"
	document.body.appendChild(container)

	const root = makeRoot()
	const shadow = container.attachShadow({ mode: "open" })
	shadow.appendChild(root)

	const resultsBox = root.querySelector(".r")

	on(root, "input", event => {
		const needle = event.target.value.trim().toLowerCase()
		resultsBox.innerHTML = ""

		if (needle === "") {
			return
		}

		const results = []
		let count = 0

		for (const entry of entries) {
			const result = fuzzyFind(entry.name, needle);
			if (result != null) {
				results.push([entry, result])
				if (++count >= 30) {
					break
				}
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
			subtitleEl.innerText = renderHtmlEntities(entry.text == null ? "" : entry.text)
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
			return
		}

		const currentActive = resultsBox.querySelector(".active")
		let newActive = null

		if (event.key === "ArrowDown" && (event.ctrlKey || event.metaKey)) {
			if (currentActive != null && currentActive.nextElementSibling != null) {
				newActive = currentActive.parentElement.lastElementChild
			}
			event.preventDefault()

		} else if (event.key === "ArrowDown" || (event.key === "n" && event.ctrlKey)) {
			if (currentActive != null && currentActive.nextElementSibling != null) {
				newActive = currentActive.nextElementSibling
			}
			event.preventDefault()

		} else if (event.key === "ArrowUp" && (event.ctrlKey || event.metaKey)) {
			if (currentActive != null && currentActive.previousElementSibling != null) {
				newActive = currentActive.parentElement.firstElementChild
			}
			event.preventDefault()

		} else if (event.key === "ArrowUp" || (event.key === "p" && event.ctrlKey)) {
			if (currentActive != null && currentActive.previousElementSibling != null) {
				newActive = currentActive.previousElementSibling
			}
			event.preventDefault()

		} else if (event.key === "Enter") {
			if (currentActive != null) {
				currentActive.click()
				event.preventDefault()
			}

		}

		if (newActive != null) {
			currentActive.classList.remove("active")
			newActive.classList.add("active")
			newActive.scrollIntoView({
				behavior: "smooth",
				block: "center",
				inline: "center",
			})
		}
	})

	root.querySelector("input").focus()
}

function fuzzyFind(haystack, needle) {
	// Higher the weight, the lower it goes in the results.
	let weight = 0
	const indices = []
	let haystackIndex = 0, needleIndex = 0

	for (; haystackIndex < haystack.length && needleIndex < needle.length; ++haystackIndex) {
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

	if (haystackIndex < haystack.length) {
		// If there's lots of remaining characters in the haystack, make it that much heavier.
		// Since the user can type extra characters to pull them up in the results.
		weight += haystack.length - haystackIndex
	}

	return needleIndex < needle.length ? null : {weight, indices}
}

function renderHtmlEntities(text) {
	return text
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&larr;/g, "\u2190")
		.replace(/&uarr;/g, "\u2191")
		.replace(/&rarr;/g, "\u2192")
		.replace(/&darr;/g, "\u2193")
		.replace(/&ndash;/g, "\u2013")
		.replace(/&mdash;/g, "\u2014")
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
