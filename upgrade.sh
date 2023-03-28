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
repo_url="git@github.com:tunogya/chatgpt.git"
repo_dir="/home/opc/chatgpt"
# shellcheck disable=SC2164
cd "$repo_dir"

echo "============ 更新代码 ============"
git checkout .
git pull origin main

echo "============ upgrade +x ============"
chmod +x upgrade.sh

echo "============ 安装依赖 ============"
npm install

echo "============ 构建项目 ============"
npm run build

echo "============ 平滑重启服务 ============"
pm2 reload "ChatGPT"

echo "============ 部署完成 ============"

# 定时任务，每小时执行一次
# crontab -e
# 0 * * * * /home/opc/chatgpt/upgrade.sh >> /home/opc/chatgpt/upgrade.log 2>&1

