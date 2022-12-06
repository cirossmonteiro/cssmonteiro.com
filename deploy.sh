rm -rf ../cirossmonteiro.github.io/*
npm run build
cp -a build/* ../cirossmonteiro.github.io
cd ../cirossmonteiro.github.io
git add .
git commit -m "deploy auto"
git push