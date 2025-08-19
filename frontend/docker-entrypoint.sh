#!/bin/sh
set -e

# Default API URL if not set
: "${REACT_APP_API_URL:=http://backend:8080/api}"

echo "⚙️ Generating config.js with API URL: $REACT_APP_API_URL"

# Create the config file in the correct location
cat > /usr/share/nginx/html/config.js <<EOL
window._env_ = {
  REACT_APP_API_URL: '${REACT_APP_API_URL}'
};
EOL

# Start Nginx in foreground
exec nginx -g "daemon off;"