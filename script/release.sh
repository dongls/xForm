#!/bin/bash

# read current version number
CURRENT_VERSION=$(cat ./package.json | grep 'version' | sed 's/.*"\(.*\).*",/\1/g')

# read new version number
echo '版本号格式为[major.minor.patch], 输入[n/N]退出'
echo "当前版本号为: $CURRENT_VERSION"

while read -p "请输入新的版本号:" VERSION; do
  if [[ $VERSION != $CURRENT_VERSION && $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then 
    break
  fi

  if [[ $VERSION =~ [nN] ]]; then
    exit 0
  fi
done

# git checkout master
echo ''

# update entry version
node script/version.js RELEASE_VERSION=$VERSION

# build
echo -e '\nbuild bundle for production'
npm run build:production -- RELEASE_VERSION=$VERSION

# build es 2015 version
echo -e '\nbuild bundle for production:ES2015'
npm run build:production -- RELEASE_VERSION=$VERSION RELEASE_TARGET=ES2015

# build example
echo -e '\nbuild bundle for expample'
npm run build:example

# commit
git add .
git commit -m "build: $VERSION"
npm version $VERSION --message "release: $VERSION"
git push

# publish
npm publish