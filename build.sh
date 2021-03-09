pushd terraform/lambda/src
npm install
popd

pushd extension-library
npm install
npm run build
popd