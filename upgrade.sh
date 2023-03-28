#!/bin/bash

function check_command_exists() {
command -v "1" >/dev/null 2>&1 || { echo >&2 "1 command is required but it's not installed. Aborting."; exit 1; }
}

check_command_exists "git"
check_command_exists "npm"
check_command_exists "pm2"

# shellcheck disable=SC2034
repo_url="git@github.com:tunogya/chatgpt.git"
repo_dir="/home/opc/chatgpt"
# shellcheck disable=SC2164
cd "$repo_dir"

echo "============ 更新代码 ============"
git pull origin main
npm install

echo "============ 构建项目 ============"
npm run build

echo "============ 重启服务 ============"
pm2 restart "ChatGPT"

echo "============ 部署完成 ============"

# 定时任务，每小时执行一次
# crontab -e
# 0 * * * * /home/opc/chatgpt/upgrade.sh

