const version = require('./package.json').version;
const fs = require('fs');
const archiver = require('archiver');

if (!fs.existsSync('target')) {
  fs.mkdirSync('target');
}

const output = fs.createWriteStream('target/geolud-client-' + version + '.zip');
const archive = archiver('zip');

archive.on('error', function (err) {
  throw err;
});


archive.pipe(output);
archive.glob('**/*', {
  cwd: 'dist',
  ignore: ['node_modules/**'],
  nodir: false
}, function (err, files) {
  console.log(files);
});
archive.finalize();
