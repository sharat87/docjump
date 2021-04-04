const fs = require("fs")

const browser = process.argv[2]
const outFile = process.argv[3]

const pkg = JSON.parse(fs.readFileSync("package.json", { encoding: "utf-8" }))

const SUPPORTED_URL_GLOBS = [
	"https://docs.oracle.com/*",
	"https://docs.spring.io/*",
	"https://projectreactor.io/*",
	"https://docs.python.org/*",
	"https://docs.docker.com/*",
	"https://nodejs.org/api/*",
	"https://jestjs.io/*",
	"https://golang.org/pkg/*",
]

const manifest = {
	manifest_version: 2,
	name: pkg.name,
	version: pkg.version,
	// The description must be <= 132 characters in length for the Chrome web store.
	description: pkg.description,
	icons: {
		512: "icon-512.png",
	},
	page_action: {
		default_title: "Open DocJump",
		default_icon: {
			16: "icon-16.png",
			24: "icon-24.png",
			32: "icon-32.png",
			19: "icon-19.png",
			38: "icon-38.png",
		},
		show_matches: SUPPORTED_URL_GLOBS,
	},
	permissions: [
		...(browser === "chrome" ? ["declarativeContent"] : []),
		...SUPPORTED_URL_GLOBS,
	],
	background: {
		scripts: ["background.js"],
	},
	commands: {
		_execute_page_action: {
			suggested_key: {
				default: "Ctrl+Shift+J",
				mac: "MacCtrl+Shift+J",
			},
			description: "Open DocJump",
		},
	},
}

fs.writeFileSync(outFile, JSON.stringify(manifest, null, 2))
