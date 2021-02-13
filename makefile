docjump.zip:
	test -f $@ && rm -f $@
	cd src && zip -r ../$@ *


.PHONY: docjump.zip
