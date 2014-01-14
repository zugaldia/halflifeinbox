from halflife.config import APP_BRANCH, CDN_ROOT, FLATUI_ROOT
from webapp2_extras import jinja2
import webapp2

class BaseHandler(webapp2.RequestHandler):
    @webapp2.cached_property
    def jinja2(self):
        return jinja2.get_jinja2(app=self.app)

    def render_response(self, _template, **context):
        rv = self.jinja2.render_template(_template, **context)
        self.response.write(rv)

class MainHandler(BaseHandler):
    def get(self):
        context = {
            'app_branch': APP_BRANCH,
            'cdn_root': CDN_ROOT,
            'flatui_root': FLATUI_ROOT}
        self.render_response('landing.html', **context)

app = webapp2.WSGIApplication([
    ('/', MainHandler)
], debug=True)
