const validUrl = require('valid-url')
const shortId = require('shortid')

const Shortener = require('../models/shortener')

exports.getHome = async (req, res) => {
    res.render('home', {
        title: 'Return Page',
    })
}

//POST ROUTE TO http:localhost:5000/shorten
exports.postUrl = async (req, res) => {
    const { longUrl, shortUrl } = req.body;

    //check if baseurl is valid
    const baseUrl = process.env.BASEURL
    if(!validUrl.isUri(baseUrl)) {
        return res.status(401).json('Invalid Base Url')
    }

    // create url if short Url doesn't exist and long url exist
    if(validUrl.isUri(longUrl) && !shortUrl) {
        try {
            let scissors = await Shortener.findOne({ longUrl })
            if(scissors) {
                res.json(scissors)
                console.log(scissors)
            } else {
                let urlCode = shortId.generate();
                const shortUrl = baseUrl + '/' + urlCode;
                const { visits, visitsFB, visitsYT, visitsIG, visitsTW } = 0

                scissors = new Shortener({
                    longUrl, shortUrl, urlCode, visits, visitsFB,
                    visitsYT, visitsIG, visitsTW, date: new Date()
                });

                await scissors.save();
                res.status(200).json(scissors);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json('Server Error');
        }
    } else if(validUrl.isUri(longUrl) && shortUrl ) {
        try {
            let scissors = await Shortener.findOne({ longUrl })
            if(scissors) {
                res.json(scissors)
            } else {
                let urlCode = shortUrl;
                const shortUrl = baseUrl + '/' + urlCode;
                scissors = new Shortener({
                    longUrl, shortUrl, urlCode, visits, visitsFB, 
                    visitsYT, visitsIG, visitsTW, date: new Date()
                });

                await scissors.save();
                res.status(200).json(scissors);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json('Server Error');
        }
        
    } else {
        res.status(401).json('Ensure inputs are correct and not empty')
    }
};

//GET ROUTE SENDS US TO http://localhost:5000/paramsUrl
exports.getShortened = async (req, res) => {
    if (req.params.shortUrl != undefined) {
        var data = await Scissors.findOne({ urlCode: req.params.shortUrl });
        console.log(data)
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
    } else {
        console.log(error)
    }
}