const mongoose = require('mongoose');

const brgySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('baranggay', brgySchema)