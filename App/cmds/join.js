module.exports.run = async (client, message, args) => {
  if (message.member.voiceChannel) {
    message.member.voiceChannel.join()
  } else {
    message.reply('You need to join a voice channel first!')
  }
}

module.exports.help = {
  name: 'join'
}
