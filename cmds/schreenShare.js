const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  if (message.member.voiceChannel) {
    await message.delete()
    serverID = message.guild.id
    voiceChannelID = message.member.voiceChannelID
    voiceChannelName = message.member.voiceChannel.name
    
    let messageString = `<https://discordapp.com/channels/${serverID}/${voiceChannelID}>`

    let author = message.author.username
    let nameTag = message.author.discriminator
    
    
    let ssEmbed = new Discord.RichEmbed()
      // .description('This is a test embed')
      // .addField('Link for Screen Share', `${messageString}`, true);
      .setColor('#0099ff')
      .setTitle('💻Screen Share link💻')
      .setDescription('This is a link for using screen sharing within the server!')
      .setThumbnail('https://static.thenounproject.com/png/500879-200.png')
      .addField(`Link for the Voice Channel "${voiceChannelName}"`, messageString)
      .setTimestamp()
      .setFooter(`Requested by ${author + nameTag}`, message.author.displayAvatarURL);

    message.channel.send(ssEmbed)
  } else {
    message.reply('You need to join a voice channel first!').then(m => m.delete(2000))
  }
}

module.exports.help = {
  name: "ss"

}