var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var memberSchema = mongoose.Schema({
    group: { type: Schema.ObjectId, ref: 'Group'},
    userId: Schema.ObjectId,
    characters: [{
        id: Number,
        name: String,
        approvedDate: Date,
        approvedBy: Schema.ObjectId,
        appliedDate: Date,
        status: { type: String, enum: ['Pending', 'Accepted', 'Inactive']},
        inactive: {
            reason: String,
            date: Date
        }
    }]
});

var Member = mongoose.model('Member', memberSchema);

module.exports = Member;