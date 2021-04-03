help:
	@echo "Run make firefox or make chrome to build extension for that browser."

%:  # Can be `firefox` or `chrome`.
	mkdir -p dist/$@
	rm -rf dist/build dist/$@/*
	node manifest-generator.js $@ dist/$@/manifest.json
	npx parcel build --no-source-maps --out-dir dist/build src/{background,content_script}.js
	cp dist/build/*.js dist/$@/
	cp -r icons/* dist/$@/
	cd dist/$@ && zip -r ../$@-docjump.zip *

src.zip: phony
	test -f src.zip && rm src.zip
	zip src.zip `git ls-files`


.PHONY: phony
