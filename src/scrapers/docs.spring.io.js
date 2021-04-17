import OracleDocsSpec from "./docs.oracle.com"

export default {

	scraper() {
		const loc = location.toString()
		return (
			loc.match(/^https:\/\/docs\.spring\.io\/spring-data\/[-a-z]+\/docs/)
				|| loc.match(/^https:\/\/docs\.spring\.io\/spring-framework\/docs/)
		) ? OracleDocsSpec.scraper() : []
	},

}
