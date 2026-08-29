#!/bin/sh
# Refresh static/cnt/ from the Greek NT webapp build on the Pi.
#
# static/cnt/ is a pure mirror of the Pi's build output, so this deletes
# local files that no longer exist upstream, then re-runs the prepare pass
# (noindex tags + directory listings) that the mirror wipes out.
#
# The section is unlisted: nothing on the site links to it, robots.txt
# disallows /cnt/, and every page carries a noindex tag.
#
# Usage: ./updateCnt.sh

set -e

cd "$(dirname "$0")"

REMOTE="mypi:Code/greek-nt-data/website/webapp/output/"

echo "Pulling ${REMOTE} -> static/cnt/"
mkdir -p static/cnt
rsync -a --delete --exclude='.DS_Store' "$REMOTE" static/cnt/

# openrsync (macOS /usr/bin/rsync) does not reliably honour --exclude,
# so drop any .DS_Store that came across regardless.
find static/cnt -name .DS_Store -delete

python3 scripts/prepare-cnt.py static/cnt

echo "Done. Preview with ./launchLocal.sh, publish with ./updateWebsite.sh"
