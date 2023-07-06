const mongoose = require('mongoose')

const Schema = mongoose.Schema

const shortenerSchema = new Schema({
    urlCode: {
        type: String
    },
    longUrl: {
        type: String, 
        required: true 
    },
    shortUrl: { 
        type: String, 
        unique: true 
    },
    visits: { 
        type: Number, 
        default: 0 
    },
    visitsFB: { 
        type: Number, 
        default: 0 
    },
    visitsYT: { 
        type: Number, 
        default: 0 
    },
    visitsIG: { 
        type: Number, 
        default: 0 
    },
    visitsTW: { 
        type: Number, 
        default: 0 
    },
    date: { 
        type: String, 
        default: Date.now 
    }
});


module.exports = mongoose.model('Shortener', shortenerSchema);