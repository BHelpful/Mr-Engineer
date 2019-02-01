const Discord = require('discord.js')
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://Andreasgdp:Agdphps119!@utilitybot-ss4dg.mongodb.net/test?retryWrites=true', {
  useNewUrlParser: true
})
const Money = require('../models/level.js')

module.exports.run = async (bot, message, args) => {
  let target = message.mentions.users.first() || message.author

  await message.delete()

  Money.findOne({
    userID: target.id,
    serverID: message.guild.id
  }, (err, level) => {
    if (err) console.log(err)

    let embed = new Discord.RichEmbed()
      .setTitle(`${target.username}#${target.discriminator}'s level info`)
      .setDescription('Level up by participating in the chat.')
      .setColor('#4000FF')
      .setThumbnail(target.displayAvatarURL)

    if (!level) {
      embed.addField('XP', '0', true)
      embed.addField('Level', '1', true)
      embed.setFooter(`300 XP til level up`, target.displayAvatarURL)
      return message.channel.send(embed)
    } else {
      let diffrence = level.level * 300 - level.xp
      embed.addField('XP', level.xp, true)
      embed.addField('Level', level.level, true)
      embed.setFooter(`${diffrence} XP til level up`, target.displayAvatarURL)
      return message.channel.send(embed)
    }
  })
}

module.exports.help = {
  name: 'level'

}
