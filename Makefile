CLOSURE = /usr/local/bin/closure-compiler
LESS = /usr/local/bin/lessc
PYTHON = /usr/local/bin/python

all:
	@echo "See Makefile for options."

serve: minify-js minify-css
	@echo Running app...
	$(PYTHON) -m SimpleHTTPServer

minify-js:
	rm -rf static/build/halflife.min.js
	$(CLOSURE) --compilation_level SIMPLE_OPTIMIZATIONS \
		--js=static/scripts/halflife.js \
		--js_output_file=static/build/halflife.min.js

minify-css:
	rm -rf static/build/halflife.min.css
	$(LESS) -x static/styles/halflife.css \
		static/build/halflife.min.css
