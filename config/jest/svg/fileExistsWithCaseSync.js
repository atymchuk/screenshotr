var fs = require('fs');
var path = require('path');

export default function fileExistsWithCaseSync(filepath) {
    var dir = path.dirname(filepath);
    if (dir === '/' || dir === '.') return true;
    var filenames = fs.readdirSync(dir);
    return filenames.indexOf(path.basename(filepath)) !== -1;
}
