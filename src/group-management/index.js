var groupService = require('./group-service'),
    memberService = require('./group-membership-service');

exports.create = groupService.create;
exports.remove = groupService.remove;
exports.getAllGroups = groupService.getAllGroups;


exports.apply = memberService.apply;
exports.getByUserId = memberService.getByUserId;
exports.getMembersByGroup = memberService.getByGroup;
exports.acceptMember = memberService.acceptMember;
exports.removeCharacter = memberService.removeCharacter;