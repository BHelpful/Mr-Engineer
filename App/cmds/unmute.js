const fs = module.require('fs')
const errors = require('../utils/errors.js')

module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission('MANAGE_MESSAGES')) return errors.noPerms(message, 'MANAGE_MESSAGES')

  let toMute = message.mentions.members.first() || message.guild.members.get(args[0])
  if (!toMute) return message.channel.send('You did not specify a user mention or ID!')

  if (toMute.id === message.author.id) return message.channel.send('You cannot unmute yourself.')
  if (toMute.highestRole.position >= message.member.highestRole.position) return message.channel.send('You cannot unmute a role that is equal to or greater than your own role.')

  let role = message.guild.roles.find(r => r.name === 'Muted')

  if (!role || !toMute.roles.has(role.id)) return message.channel.send('This user is not muted!')

  await toMute.removeRole(role)

  delete bot.mutes[toMute.id]

  let roleM = message.guild.roles.find(r => r.name === 'Medlem')
  if (!roleM) {
    try {
      roleM = await message.guild.createRole({
        name: 'Medlem'
      })
    } catch (e) {
      console.log(e.stack)
    }
  }

  await (toMute.addRole(roleM))

  message.channel.send(`<@${toMute.id}> has been umuted!`)

  fs.writeFile('./mutes.json', JSON.stringify(bot.mutes), err => {
    if (err) throw err
    console.log(`I have unmuted ${toMute.user.tag}.`)
  })
}

module.exports.help = {
  name: 'unmute'

}