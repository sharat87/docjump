const SCRAPERS = [];

export default {

	define(re, scraper) {
		SCRAPERS.push({patterns: Array.isArray(re) ? re : [re], scraper})
	},

	getAll() {
		return SCRAPERS
	},

}
