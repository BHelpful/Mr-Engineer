const config = require('../botsettings.json')
const Discord = require('discord.js')

module.exports.noPerms = (message, perm) => {
  let embed = new Discord.RichEmbed()
    .setAuthor(message.author.username)
    .setTitle('NO PERMS')
    .setColor(config.red)
    .addField('Insufficient permission', `You need: "${perm}"`)

  message.channel.send(embed).then(msg => msg.delete(5000))
}
