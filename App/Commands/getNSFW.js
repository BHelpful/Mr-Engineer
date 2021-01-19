module.exports.run = async (client, message, args) => {
  let role = message.guild.roles.find('name', 'NSFW')
  message.member.addRole(role)
}

module.exports.help = {
  name: 'getnsfw'

}
