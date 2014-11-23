var groupService = require('./group-service'),
    memberService = require('./group-membership-service');

exports.create = groupService.create;
exports.remove = groupService.remove;
exports.apply = memberService.apply;
exports.getByUserId = memberService.getByUserId;