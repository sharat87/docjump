all: src-zip firefox chrome

firefox chrome:
	mkdir -p dist/$@
	rm -rf dist/build dist/$@/*
	node manifest-generator.js $@ dist/$@/manifest.json
	npx parcel build --no-source-maps --out-dir dist/build src/{background,content_script}.js
	cp dist/build/*.js dist/$@/
	cp -r icons/* dist/$@/
	cd dist/$@ && zip -r ../$@-docjump.zip *

src-zip:
	test -f dist/src.zip && rm dist/src.zip || true
	mkdir -p dist
	zip dist/src.zip `git ls-files`
