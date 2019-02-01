module.exports.run = async (bot, message, args) => {
  if (bot.voice.connections) {
    if (message.member.voiceChannel) {
      message.member.voiceChannel.leave()
    } else {
      message.reply('You must be in a voice channel first!')
    }
  }
}

module.exports.help = {
  name: 'leave'
}
