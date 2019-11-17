const sharp  = require('sharp'),
    uuidv4   = require('uuid/v4'),
    util     = require('util'),
    path     = require('path'),
    fs       = require('fs'),
    fsUnlink = util.promisify(fs.unlink);

class AvatarService {
    constructor(directory) {
        this.directory = directory;
    }
    
    async store(buffer) {
        const fileName = AvatarService.fileName(),
            filePath   = this.filePath(fileName);
    
        await sharp(buffer)
        .resize(300, 300, {
            fit: sharp.fit.inside,
            withoutEnlargement: true,
        })
        .toFile(filePath);
        return fileName;
    }
    
    async thumbnail(fileName) {
        return sharp(this.filePath(fileName))
        .resize(50, 50)
        .toBuffer();
    }
    
    async delete(fileName) {
        return fsUnlink(this.filePath(fileName));
    }
    
    static fileName() {
        return `${uuidv4()}.png`;
    }
    
    filePath(fileName) {
        return path.resolve(`${this.directory}/${fileName}`);
    }
}
    
module.exports = AvatarService;
      