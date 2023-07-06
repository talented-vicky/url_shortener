import express from 'express';

const shortCtrl = require('../controllers/shortener')

const router = express.Router();

router.get('/', shortCtrl.getHome)

//POST ROUTE TO http:localhost:5000/scissors/shorten
router.post('/shorten', shortCtrl.postUrl)


//GET ROUTE SENDS US TO http://localhost:5000/scissors/
router.get('/:shortUrl?', shortCtrl.getShortened)


module.exports = router;