import os

# Identify the app branch
if os.environ.get('SERVER_SOFTWARE', '').startswith('Development'):
    APP_BRANCH = 'development'
else:
    APP_BRANCH = 'production'

# CDN
CDN_ROOT = 'dvpjn2pyyrbbb.cloudfront.net'
FLATUI_ROOT = CDN_ROOT + '/flatui/latest/HTML/UI/Flat-UI-Pro-1.2.5'
