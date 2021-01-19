module.exports.run = async (client, message, args) => {
  if (client.voice.connections) {
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
