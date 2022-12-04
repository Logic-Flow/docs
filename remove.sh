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