#! /bin/sh
if [ -z "$API"  ]; then
  export API=dist/main.js
fi

# Directory API
cd /api

# Run Node.js Process
node $API --port 3000
