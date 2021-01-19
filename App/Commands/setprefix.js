const Discord = require('discord.js')
const fs = require('fs')
const errors = require('../utils/errors.js')

module.exports.run = async (client, message, args, prefix) => {
  if (!message.member.hasPermission('MANAGE_GUILD')) return errors.noPerms(message, 'MANAGE_SERVER')
  if (!args[0] || args[0 === 'help']) return message.reply(`Usage: ${prefix} <desired prefix here>`)

  let prefixes = JSON.parse(fs.readFileSync('./prefixes.json', 'utf8'))

  prefixes[message.guild.id] = {
    prefixes: args[0]
  }

  fs.writeFile('./prefixes.json', JSON.stringify(prefixes), (err) => {
    if (err) console.log(err)
  })

  let pEmbed = new Discord.RichEmbed()
    .setColor('#FF9900')
    .setTitle('Prefix set!')
    .setDescription(`Set to: ${args[0]}`)

  message.channel.send(pEmbed)
}

module.exports.help = {
  name: 'setprefix'

}
