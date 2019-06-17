const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  if (message.member.voiceChannel) {
    await message.delete()
    serverID = message.guild.id
    voiceChannelID = message.member.voiceChannelID
    console.log(voiceChannelID);
    
    messageString = `<https://discordapp.com/channels/${serverID}/${voiceChannelID}>`

    message.channel.send(messageString).then(m => m.delete(10000))
  } else {
    message.reply('You need to join a voice channel first!').then(m => m.delete(2000))
  }
}

module.exports.help = {
  name: "ss"

}