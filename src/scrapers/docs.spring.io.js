import OracleDocsSpec from "./docs.oracle.com"

export default {

	patterns: [
		/^https:\/\/docs\.spring\.io\/spring-data\/[-a-z]+\/docs/,
		/^https:\/\/docs\.spring\.io\/spring-framework\/docs/,
	],

	scraper: OracleDocsSpec.scraper,

}
