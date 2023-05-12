#!/bin/bash

# check git, npm, pm2 command exist
if ! command -v git &> /dev/null
then
    echo "git could not be found"
    exit
fi

if ! command -v npm &> /dev/null
then
    echo "npm could not be found"
    exit
fi

if ! command -v pm2 &> /dev/null
then
    echo "pm2 could not be found"
    exit
fi

# shellcheck disable=SC2034
repo_dir="/home/opc/chatgpt"
# shellcheck disable=SC2164
cd "$repo_dir"

echo "============ git pull ============"
git fetch --all
git reset --hard origin/main
git pull origin main

echo "============ upgrade +x ============"
chmod +x upgrade.sh

echo "============ npm install ============"
npm install

echo "============ build ============"
npm run build

echo "============ pm2 reload ============"
pm2 reload "ChatGPT"

echo "============ DONE ============"
