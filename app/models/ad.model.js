const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const adSchema = new mongoose.Schema({
    category: { type:String, required: true },
    description: { type: String, required: true },
    contactPhone: { type: String, required: true },
    contactEmail: { type: String, required: false },
    contactName: { type: String, required: true },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    adImage: { type: String, required: false, default: '/assets/ad_img.png' },
},
    { timestamps: true });

adSchema.plugin(mongoosePaginate);

const Ad = mongoose.model('Ad', adSchema);


module.exports = Ad;
