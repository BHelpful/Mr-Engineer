const Discord = require("discord.js");
const errors = require('../utils/errors.js');


module.exports.run = async (client, message, args) => {
  if (!message.member.hasPermission('MANAGE_MESSAGES')) return errors.noPerms(message, 'MANAGE_MESSAGES')
  if (!args[0]) return message.channel.send('Proper Usage: <prefix>vote *Insert question here*')
  await message.delete()

  let sender = message.author

  let yes = null
  let yesID = null
  let no = null
  let noID = null
  
  let messageList = args.slice(0)
  let mentionList = []
  let placementSubtractor = 0
  for (let index = 0; index < args.length; index++) {
    const element = args[index];
    if (element.startsWith('<@') && element.endsWith('>') || element === '@everyone' || element === '@here')
    {
      // !UNCOMMENT TO REMOVE THE MENTIONS FROM THE POLL COMMAND
      // messageList.splice(index - placementSubtractor, 1)
      // placementSubtractor++
      // !------------------------------------------------------
      mentionList.push(element)
    }
  }
  mentionList.join(' ')


  if (message.guild.id === '432893133874003968') 
  {
    yes = client.emojis.get('588366475220353044').toString()
    yesID = '588366475220353044'
    no = client.emojis.get('588366496149798922').toString()
    noID = '588366496149798922'
  } else if (message.guild.id === '453202034489819166') 
  {
    yes = client.emojis.get('609661997251952661').toString()
    yesID = '609661997251952661'
    no = client.emojis.get('609662011751530521').toString()
    noID = '609662011751530521'
  } else 
  {
    yes = '✅'
    yesID = '✅'
    no = '❎'
    noID = '❎'
  }


  const voteEmbed = new Discord.RichEmbed()
    .setAuthor(`${sender.username} created a poll`, sender.displayAvatarURL)
    .setColor('#a3008d')
    .setDescription(`${messageList.join(' ')}`)
    .addField('Poll creator', `${sender}  \nReact to vote! (${yes} or ${no})`)


  if (mentionList.length != 0) 
  {
    await message.channel.send(mentionList)
  }
  let msg = await message.channel.send(voteEmbed)

  await msg.react(yesID)
  await msg.react(noID)
}


module.exports.help = {
  name: "poll"
}