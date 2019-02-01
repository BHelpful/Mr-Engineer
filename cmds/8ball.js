const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
  if (!args[2]) return message.reply('Please ask a full question!')
  let replies = ['Yes.', 'No.', 'maybe', "I don't know.", 'Ask again.', 'How should I know?', 'Ask again later.']
  let result = Math.floor((Math.random() * replies.length))
  let question = args.slice(0).join(' ')
  let ballEmbed = new Discord.RichEmbed()
    .setColor('#FF9900')
    .addField('Question', question)
    .addField('Answer', replies[result])
  message.channel.send(ballEmbed)
}

module.exports.help = {
  name: '8ball'

}
