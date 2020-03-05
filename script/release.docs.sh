#!/bin/bash

set -e
# read -p "请输入Commit Message:" MESSAGE;

# npm run build:docs
npm run build:example
# echo 'xform.imdo.me' > ./docs/CNAME

# git add .
# git commit -m "docs: $MESSAGE"