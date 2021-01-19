const Discord = require('discord.js')
const snekfetch = require('snekfetch')

exports.run = async (client, message, args) => {
  try {
    const {
      body
    } = await snekfetch
      .get('https://www.reddit.com/r/dankmemes/top.json?sort=top&t=week')
    const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18)
    if (!allowed.length) return message.channel.send('It seems we are out of fresh memes!, Try again later.')
    const randomnumber = Math.floor(Math.random() * allowed.length)
    let theMeme = allowed[randomnumber].data
    // console.log(theMeme)
    const embed = new Discord.RichEmbed()
      .setColor(0x00A2E8)
      .setTitle(theMeme.title)
      .setURL(`https://www.reddit.com${theMeme.permalink}`)
      .setDescription('Posted by: ' + theMeme.author)
      .setImage(theMeme.url)
      .setFooter(`👍 ${theMeme.ups} 💬 ${theMeme.num_comments}`)
    message.channel.send(embed)
  } catch (err) {
    return console.log(err)
  }
}

module.exports.help = {
  name: 'meme'
}
