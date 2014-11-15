var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var memberSchema = mongoose.Schema({
    groupId: Schema.ObjectId,
    userId: Schema.ObjectId,
    characters: [{
        id: Number,
        name: String,
        approvedDate: Date,
        approvedBy: Schema.ObjectId,
        appliedDate: Date,
        status: { type: String, enum: ['Pending', 'Member', 'Manager', 'Owner', 'Probation']}
    }]
});

var Member = mongoose.model('Member', memberSchema);

module.exports = Member;