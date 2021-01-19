// const Discord = require('discord.js')
const errors = require('../utils/errors.js');

module.exports.run = async (client, message, args) => {
	// addrole @test1 Member
	if (!message.member.hasPermission('MANAGE_ROLES'))
		return errors.noPerms(message, 'MANAGE_ROLES');
	let rMember =
		message.guild.member(message.mentions.users.first()) ||
		message.guild.members.cache.get(args[0]);
	if (!rMember) return message.reply("Couldn't find that user, yo");
	let role = args.join(' ').slice(23);

	console.log(role);
	if (!role) return message.reply('Specify a role!');
	let gRole = message.guild.roles.cache.find((r) => r.name === role);
	if (!gRole) return message.reply("Couldn't find that role.");
// TODO fix if statement below
	if (rMember.roles.cache.some((r) => r.name === gRole.id))
		return message.reply('They already have that role.');
	(await rMember.addRole(gRole.id)) &&
		message.channel.send(`The role ${gRole} has been added to ${rMember}`);
};

module.exports.help = {
	name: 'addrole',
};
