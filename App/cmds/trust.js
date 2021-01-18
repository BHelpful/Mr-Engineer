// const Discord = require('discord.js')
const errors = require('../utils/errors.js')

module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission('MANAGE_CHANNELS')) return errors.noPerms(message, 'MANAGE_CHANNELS')
  let rMember = message.mentions.members.first() || message.guild.members.get(args[0])
  if (!rMember) return message.reply("Couldn't find that user, yo")
  let role = message.guild.roles.find(r => r.name === 'Trusted')
  if (!role) {
    try {
      role = await message.guild.createRole({
        name: 'Trusted',
        color: '#4286f4',
        permissions: []
      })
    } catch (e) {
      console.log(e.stack)
    }
  }

  if (rMember.roles.has(role.id)) return message.reply('They already have that role.')
  await (rMember.addRole(role.id)) && message.channel.send(`${rMember} is now ${role}`)
}

module.exports.help = {
  name: 'trust'

}
