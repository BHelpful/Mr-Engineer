module.exports.run = async (client, message, args) => {
  let link = await client.generateInvite(['ADMINISTRATOR'])
  message.channel.send(link)
}

module.exports.help = {
  name: 'invite'
}
