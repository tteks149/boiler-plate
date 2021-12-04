const mongoose = require('mongoose');
const Schema =mongoose.Schema;

const medalSchema = mongoose.Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    medalTitle: {
        type:String
    },
    name : {
        type:String,
        maxLength:50 
    }, 
    price:{
        type:Number
    },
    description: {
        type:String
    },
    count: {
        type:Number,
        default:0
    }
   
},{timestamps: true})

const Medal = mongoose.model('Medal', medalSchema);

module.exports = { Medal }