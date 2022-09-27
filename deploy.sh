#!/usr/bin/env sh

# 发生错误时终止
set -e

cd examples

# 构建
npm run build

# 进入构建文件夹
cd dist

# 如果你要部署到自定义域名
# echo 'www.example.com' > CNAME
git config --global user.email "1059037014@qq.com"
git config --global user.name "wumail"

git checkout master
git add -A
git commit -m 'deploy'

# 如果你要部署在 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果你要部署在 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages
git push -f git@github.com:logic-flow/docs.logic-flow.cn.git master:gh-pages

cd -
