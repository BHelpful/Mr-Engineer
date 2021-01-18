const Discord = module.require('discord.js')
const errors = require('../utils/errors.js')

module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission('BAN_MEMBERS')) return errors.noPerms(message, 'BAN_MEMBERS')

  let bUser = message.mentions.members.first() || message.guild.members.get(args[0])
  if (!bUser) return message.channel.send("Couldn't find user!")
  let reason = args.join(' ').slice(22)
  if (reason === '') return message.channel.send('You have to give a reason to ban this user!')

  if (bUser.hasPermission('MANAGE_MESSAGES')) return message.channel.send("This user can't be banned!")

  let banEmbed = new Discord.RichEmbed()
    .setDescription('~ban~')
    .setColor('#821201')
    .addField('Banned User', `${bUser} with ID: ${bUser.id}`)
    .addField('Banned by', `<@${message.author.id}> with ID: ${message.author.id}`)
    .addField('Banned In', message.channel)
    .addField('Time', message.createdAt)
    .addField('Reason', reason)

  if (!message.guild.channels.find(`name`, 'incidents')) {
    await message.guild.createChannel('incidents', 'text')
  }
  let incidentsChannel = message.guild.channels.find(`name`, 'incidents')
  if (!incidentsChannel) return message.channel.send("Couldn't find incidents channel!")

  message.guild.member(bUser).ban(reason)
  incidentsChannel.send(banEmbed)
}

module.exports.help = {
  name: 'ban'
}
