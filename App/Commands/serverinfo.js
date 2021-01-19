const Discord = module.require('discord.js')

module.exports.run = async (client, message, args) => {
  var help = args.join('_')

  let server = message.guild
  let joiningPoint = ` | `
  let findRoles = server.roles.map(r => r).join(joiningPoint)
  let findChannels = server.channels.filter(c => c.type === 'text').map(c => c).join(joiningPoint)

  if (help === '') {
    let embed = new Discord.RichEmbed()
      .setColor(0xffffff)
      .setTitle(`Details about: ${server}`)
      .setDescription('______________')
      .addField('Server name', server.name, true)
      .addField('Server-ID', server.id, true)
      .addField('Owner', server.owner, true)
      .addField('Owner ID', server.ownerID, true)
      .addField('Members', server.members.filter(member => !member.user.bot).size, true)
      .addField('Bots', server.members.filter(member => member.user.bot).size, true)
      .addField('Roles', server.roles.size, true)
      .addField('Rolenames:', findRoles, true)
      .addField('TEXT CHANNELS:', findChannels, true)
      .addField('Region', server.region, true)
      .addField('Server was created', server.createdAt)
      .setThumbnail(server.iconURL)
    message.channel.send(embed)
  } else if (help === 'test') {
    console.log(server)
  }
}
module.exports.help = {
  name: 'serverinfo'
}
