// Include The File
const fs = require('fs');
// Include The Util To Pass Data Through Promise
const util = require('util');
// Passing Readfile Function as Argument
const readFile = util.promisify(fs.readFile);// We are Just Passing Data through. So, not using The Parenthesis for Readfile Function


// Speaker Service to Get The Data from File.
class SpeakerService
{
    // Data Will Load Automatically, When The Speaker Service Class Called
    constructor(dataFile)
    {
        this.dataFile = dataFile;
    }

    async getNames()
    {
        // Get All Data
        const data = await this.getData();

        // Returns The Mapped Data (What We Only Need)
        return data.map((speaker) => {
            return {
                name: speaker.name,
                shortname: speaker.shortname
            };
        });
    }

    // Get The Short List of All Speaker
    async getListShort()
    {
        const data = await this.getData();

        // Returns The Mapped Data (What We Only Need)
        return data.map((speaker) => {
            return {
                name: speaker.name,
                shortname: speaker.shortname,
                title: speaker.title,
            };
        });
    }

    // Get The List of All Speaker
    async getList()
    {
        const data = await this.getData();

        // Returns The Mapped Data (What We Only Need)
        return data.map((speaker) => {
            return {
                name: speaker.name,
                shortname: speaker.shortname,
                title: speaker.title,
                summary: speaker.summary,
            };
        });
    }

    // Get All Artwork
    async getAllArtWork()
    {
        const data = await this.getData();
        const artwork = data.reduce((accumulator, element) => {
            if(element.artwork) {
                accumulator = [...accumulator, ...element.artwork];
            }

            return accumulator;
        }, []);

        return artwork;
    }

    // Get Single Speaker
    async getSpeaker(shortname)
    {
        const data = await this.getData();
        const speaker = data.find((speaker) => {
            return speaker.shortname == shortname;
        });

        if(!speaker) return null;

        return {
            title: speaker.title,
            name: speaker.name,
            shortname: speaker.shortname,
            description: speaker.description
        };
    }

    // Get Artwork of Single Speaker
    async getArtworkForSpeaker(shortname) 
    {
        const data = await this.getData();
        const speaker = data.find((speaker) => {
            return speaker.shortname == shortname;
        });

        if(!speaker || !speaker.artwork) return null;

        return speaker.artwork;
    }

    // Get Data from The Constructor
    async getData()
    {
        // Wait for The readFile Promise to be Executed
        const data = await readFile(this.dataFile, 'utf8');

        if (!data) return [];
        
        return JSON.parse(data).speakers;
    }
}

module.exports = SpeakerService;
