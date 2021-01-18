module.exports.run = async (bot, message, args) => {
  let link = await bot.generateInvite(['ADMINISTRATOR'])
  message.channel.send(link)
}

module.exports.help = {
  name: 'invite'
}
