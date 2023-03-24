npm install yarn
yarn
yarn build
rm -rf ./deploy
mkdir -p deploy/examples
mkdir -p deploy/docs
mkdir -p deploy/demo
cp -rf index.html ./deploy
cp -rf ./docs/* ./deploy/docs
cp -rf ./examples/dist/* ./deploy/examples
cd ./demo
for file in ./*
do
if [ -d $file/dist ];then
    echo $file/dist
    mkdir -p ./dist/$file
    cp -rf $file/dist/* dist/$file/
fi
done
cd -
cp -rf ./demo/dist ./deploy/demo