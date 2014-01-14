# Required to run in local mode
PYTHON = /usr/local/bin/python
APPENGINE = /usr/local/google_appengine

# This only required for deployment
CLOSURE = closure
LESS = lessc

# App paths
APP_ROOT = app
APP_SCRIPTS = $(APP_ROOT)/static/scripts
APP_STYLES = $(APP_ROOT)/static/styles

# App Engine IDs
APP_ID_LIVE = halflifeinbox

all:
	@echo "See Makefile for options."

run:
	@echo Running app...
	$(PYTHON) $(APPENGINE)/dev_appserver.py $(APP_ROOT) --require_indexes

clean-run:
	@echo Running clean app...
	$(PYTHON) $(APPENGINE)/dev_appserver.py $(APP_ROOT) --clear_datastore --require_indexes


deploy: minify-js minify-css
	@echo Uploading app...
	$(PYTHON) $(APPENGINE)/appcfg.py \
		--noauth_local_webserver --oauth2 \
		--application=$(APP_ID_LIVE) \
		update $(APP_ROOT)

minify-js:
	java -jar $(CLOSURE)/compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS \
		--js=$(APP_SCRIPTS)/dev/halflife.js \
		--js_output_file=$(APP_SCRIPTS)/halflife.min.js

minify-css:
	$(LESS) -x $(APP_STYLES)/dev/halflife.css \
		$(APP_STYLES)/halflife.min.css
