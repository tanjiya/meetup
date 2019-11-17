const fs        = require('fs'),
    util        = require('util'),
    // Passing Readfile Function as Argument
    readFile = util.promisify(fs.readFile),
    writeFile  = util.promisify(fs.writeFile);

// Speaker Service to Get The Data from File.
class FeedbackService
{
    // Data Will Load Automatically, When The Speaker Service Class Called
    constructor(dataFile)
    {
        this.dataFile = dataFile;
    }

    // Get The Posted Feedback
    async addEntry(name, title, message)
    {
        const data = await this.getData();
        data.unshift({ name, title, message });

        return writeFile(this.dataFile, JSON.stringify(data));
    }

    // Get The List of Feedback
    async getList()
    {
        const data = await this.getData();
        return data;
    }

    // Get Data from The Constructor
    async getData()
    {
        // Wait for The readFile Promise to be Executed
        const data = await readFile(this.dataFile, 'utf8');
        
        if (!data) return [];
        
        return JSON.parse(data);
    }
}

module.exports = FeedbackService;
