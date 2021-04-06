#!/bin/bash

version=${1?Error: Pass new version}
currentVersion=$(node -p "require('./package.json').version")

if [[ "$version" == "$currentVersion" ]]
then
  git merge origin "$version" --allow-unrelated-histories
  git commit -am v"$version"
  git tag v"$version"
  git push -u origin master && git push -u origin master --tags
else
  echo "Mismatch between provided versions. Current version: "$currentVersion", release version: "$version
fi
