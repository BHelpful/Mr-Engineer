const Discord = module.require('discord.js')
const errors = require('../utils/errors.js')

module.exports.run = async (client, message, args) => {
  if (!message.member.hasPermission('MANAGE_MESSAGES')) return errors.noPerms(message, 'MANAGE_MESSAGES')

  let kUser = message.mentions.members.first() || message.guild.members.get(args[0])
  if (!kUser) return message.channel.send("Couldn't find user!")
  let reason = args.join(' ').slice(22)
  if (reason === '') return message.channel.send('You have to give a reason to kick this user!')
  if (kUser.hasPermission('MANAGE_MESSAGES')) return message.channel.send("This user can't be kicked!")

  if (kUser.highestRole.position >= message.member.highestRole.position) return message.channel.send('You cannot kick a role that is equal to or greater than your own role.')

  let kickEmbed = new Discord.RichEmbed()
    .setDescription('~kick~')
    .setColor('#f49e42')
    .addField('Kicked User', `${kUser} with ID: ${kUser.id}`)
    .addField('Kicked by', `<@${message.author.id}> with ID: ${message.author.id}`)
    .addField('Kicked In', message.channel)
    .addField('Time', message.createdAt)
    .addField('Reason', reason)

  if (!message.guild.channels.find(`name`, 'incidents')) {
    await message.guild.createChannel('incidents', 'text')
  }
  let incidentsChannel = message.guild.channels.find(`name`, 'incidents')
  if (!incidentsChannel) return message.channel.send("Couldn't find incidents channel!")

  message.guild.member(kUser).kick(reason)

  incidentsChannel.send(kickEmbed)
}

module.exports.help = {
  name: 'kick'

}
