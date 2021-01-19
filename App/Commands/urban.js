const Discord = require('discord.js')
const urban = require('urban.js')

module.exports.run = async (client, message, args) => {
  if (args.length < 1) return message.channel.send('Please enter search tag.')
  let str = args.join(' ')
  urban(str).then(json => {
    if (!json) return message.channel.send('No results found, please try again.')
    console.log(json)

    let embed = new Discord.RichEmbed()
      .setAuthor('Urban Dictionary', 'https://vignette.wikia.nocookie.net/logopedia/images/0/0b/UDFavicon.png')
      .setTitle(json.word)
      .setURL(json.URL)
      .setColor('#d17308')
      .setDescription(json.definition)
      .addField('Example', json.example, true)
      .addBlankField()
      .addField('Rating', `:thumbup: ${json.thumbsUp} :thumbdown: ${json.thumbsDown}`)
      .setFooter(`Written by ${json.author}`)

    message.channel.send(embed)
  })
}

module.exports.help = {
  name: 'urban'
}
