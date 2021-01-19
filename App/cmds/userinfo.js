const Discord = module.require('discord.js')

module.exports.run = async (client, message, args) => {
  let target = message.mentions.users.first() || message.author
  let member = message.mentions.members.first() || message.member
  let userPic = target.displayAvatarURL

  let nickname = member.nickname
  if (nickname == null) {
    nickname = 'User has no nickname!'
  }

  let joiningPoint = ` | `

  let findRoles = member.roles.filter(r => r !== '@everyone').map(r => r).join(joiningPoint)

  if (member.roles.size - 1 === 0) {
    findRoles = `User has no roles!`
  }

  let embed = new Discord.RichEmbed()
    .setColor('#9B59B6')
    .setThumbnail(userPic)
    .setTitle('Details about: ' + target.username + '#' + target.discriminator)
    .setDescription('____________________')
    .addField('Username', `${target.username}#${target.discriminator}`, true)
    .addField('Nickname:', nickname, true)
    .addField('ID', `${target.id}`, true)
    .addField('Joined Server', member.joinedAt, true)
    .addField('Account created', `${target.createdAt}`, true)
    .addField('Roles:', findRoles, true)
  console.log(target)

  message.channel.send(embed)
}

module.exports.help = {
  name: 'userinfo'

}
