const Discord = module.require('discord.js')
const urban = module.require('urban')

module.exports.run = async (bot, message, args) => {
  var help = args.join('_')
  if (help === 'urban') {
    urban.random().first(json => {
      if (!json) return message.channel.send('No resoults found please try again.')

      console.log(json)

      let embed = new Discord.RichEmbed()
        .setAuthor('Urban Dictionary', 'https://vignette.wikia.nocookie.net/logopedia/images/0/0b/UDFavicon.png')
        .setTitle(json.word)
        .setURL(json.permalink)
        .setColor('#d17308')
        .setDescription(json.definition)
        .addField('Example', json.example, true)
        .addBlankField()
        .addField('Rating', `:thumbup: ${json.thumbs_up} :thumbdown: ${json.thumbs_down}`)
        .setFooter(`Written by ${json.author}`)

      message.channel.send(embed)
    })
  }
}

module.exports.help = {
  name: 'random'
}
