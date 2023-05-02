const fs = require('fs')
const path = require('path')
const readableStream = fs.createReadStream(path.join('01-read-file', './text.txt'), 'utf8');

readableStream.on('data', (chunk) =>  {
	console.log(chunk);
});

readableStream.on('error', (err) => {
	console.log(err);
});
