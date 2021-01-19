const Discord = module.require('discord.js')

module.exports.run = async (client, message, args) => {
  let pTime = Date.now() - message.createdTimestamp

  if (pTime <= 0) {
    pTime = pTime * -1
  }

  let embed = new Discord.RichEmbed()
    .addField('pong', `${pTime}` + ' ms')

  message.channel.send(embed)
}

module.exports.help = {
  name: 'ping'

}
