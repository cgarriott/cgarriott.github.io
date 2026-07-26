#!/bin/sh
# Launch the Hugo site locally with live reload.
# View it at http://localhost:1313/

set -e

cd "$(dirname "$0")"

hugo server -D
