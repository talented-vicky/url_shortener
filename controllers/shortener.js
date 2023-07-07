const validUrl = require('valid-url')
const shortId = require('shortid')

const Shortener = require('../models/shortener')

const dotenv = require('dotenv')
dotenv.config();

const initUrl = process.env.baseurl
const port = process.env.port
const baseUrl = `${initUrl}${port}/`


exports.getHome = async (req, res) => {
    res.render('home', {
        title: 'Return Page',
    })
}

//POST ROUTE TO http:localhost:5000/shorten
exports.postUrl = async (req, res) => {
    const { longUrl, shortUrl } = req.body;

    //check if baseurl is valid
    if(!validUrl.isUri(baseUrl)) {
        return res.status(401).json('Invalid Base Url')
    }

    // create url if short Url doesn't exist and long url exist
    if(validUrl.isUri(longUrl) && !shortUrl) {
        try {
            let shortener = await Shortener.findOne({ longUrl })
            if(shortener) {
                res.json(shortener)
            } else {
                let urlCode = shortId.generate();
                const shortUrl = baseUrl + '/' + urlCode;
                const { visits, visitsFB, visitsYT, visitsIG, visitsTW } = 0

                shortener = new Shortener({
                    longUrl, shortUrl, urlCode, visits, visitsFB,
                    visitsYT, visitsIG, visitsTW, date: new Date()
                });

                await shortener.save();
                res.status(200).json(shortener);
            }
        } catch (error) {
            res.status(500).json('Server Error');
        }
    } else if(validUrl.isUri(longUrl) && shortUrl ) {
        try {
            let shortener = await Shortener.findOne({ longUrl })
            if(shortener) {
                res.json(shortener)
            } else {
                let urlCode = shortUrl;
                const shortUrl = baseUrl + '/' + urlCode;
                shortener = new Shortener({
                    longUrl, shortUrl, urlCode, visits, visitsFB, 
                    visitsYT, visitsIG, visitsTW, date: new Date()
                });

                await shortener.save();
                res.status(200).json(shortener);
            }
        } catch (error) {
            res.status(500).json('Server Error');
        }
        
    } else {
        res.status(401).json('Ensure inputs are correct and not empty')
    }
};

//GET ROUTE SENDS US TO http://localhost:5000/paramsUrl
exports.getShortened = async (req, res) => {
    if (req.params.shortUrl == undefined) {
        error = new Error("ShortUrl not defined")
        error.statusCode = 500
        throw error
    }
    try {
        var data = await Shortener.findOne({ urlCode: req.params.shortUrl });
        if (data) {
            data.visits = data.visits + 1;
            var ref = req.query.ref;
            if (ref) {
                switch(ref){
                    case "fb":
                        data.visitsFB = data.visitsFB + 1;
                        break;
                    case "ig":
                        data.visitsIG = data.visitsIG + 1;
                        break;
                    case "yt":
                        data.visitsYT = data.visitsYT + 1;
                        break;
                    case "tw":
                        data.visitsTW = data.visitsTW + 1;
                        break;   
                }
            }
            await data.save();
            res.redirect(data.longUrl);
        }   
    } catch (error) {
        res.status(500).json('Server Error');
    } 
}