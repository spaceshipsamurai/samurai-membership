var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var groupSchema = mongoose.Schema({
    name: { type: String, required: 'Group Name is required' },
    forumGroupId: Number,
    teamspeakId: Number,
    createdDate: { type: Date, required: 'Created Date is required' },
    createdBy: { type: Schema.ObjectId, ref: 'User', required: 'Created By is required'},
    owner: {
        id: Number,
        name: String
    },
    managers: [{
        id: Number,
        name: String
    }]
});

var Group = mongoose.model('Group', groupSchema);

module.exports = Group;