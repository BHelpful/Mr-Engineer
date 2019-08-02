// Comment out when testing
// * Use when putting online
// ------------------------------------------------------------------
const testingSettings = false
try {
  const onlineSettings = require('./ignored_folder/ignoredsettings.json')
} catch (error) {
  console.log(error)
}
// ------------------------------------------------------------------

// * Comment out when putting online
// Use when testing
// ------------------------------------------------------------------
// const testingSettings = true
// const testSettings = require('./ignored_folder/ignoredsettings.json')
// ------------------------------------------------------------------


function checkingTesting(testingSettings, name) {
  if (testingSettings) {
    return testSettings[name]
  } else if (!testingSettings) {
    return onlineSettings[name]
  }
}

// Values determined by the testing mode of the bot (online/local)
const mongooseValue = checkingTesting(testingSettings, 'mongooseToken')
const googleValue = checkingTesting(testingSettings, 'GOOGLE_API_KEY')
const tokenValue = checkingTesting(testingSettings, 'BOT_TOKEN')

const {
  Util
} = require('discord.js')
const botSettings = require('./botsettings.json')
const Discord = require('discord.js')
const fs = require('fs')
const prefix = botSettings.prefix
const defaultPrefix = '-'
const bot = new Discord.Client({
  disableEveryone: true
})
const mongoose = require('mongoose')
const Level = require('./models/level.js')
const errors = require('./utils/errors.js')
const YouTube = require('simple-youtube-api')
const ytdl = require('ytdl-core')
const snekfetch = require('snekfetch')

mongoose.connect(`mongodb+srv://Andreasgdp:${mongooseValue}@utilitybot-ss4dg.mongodb.net/test?retryWrites=true`, {
  useNewUrlParser: true
})

const youtube = new YouTube(`${googleValue}`)

const queue = new Map()

bot.commands = new Discord.Collection()
bot.mutes = require('./mutes.json')

// Loads the commands for the bot:
fs.readdir('./cmds/', (err, files) => {
  if (err) console.error(err)

  let jsfiles = files.filter(f => f.split('.').pop() === 'js')
  if (jsfiles.length <= 0) {
    console.log('No commands to load!')
    return
  }

  if (testingSettings) {
    console.log(`Loading ${jsfiles.length} commands!`)
  }

  jsfiles.forEach((f, i) => {
    let props = require(`./cmds/${f}`)

    if (props && props.help) {
      bot.commands.set(props.help.name, props)
    } else {
      //throw or handle error here
    }
  })
})

// Sends an embed when joining a server:
bot.on('guildCreate', async guild => { })

// Sends warnings to the console:
bot.on('warn', (e) => console.warn(e))

// Sends errors to the console:
bot.on('error', (e) => console.error(e))

// Sends debugging information to the console:
// bot.on('debug', (e) => console.info(e));

// Code that runs when the bot is active/ready and in set intervals:
bot.on('ready', async () => {
  console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`)

  bot.user.setActivity(prefix + 'help ' + `|| On ${bot.guilds.size} servers!`)

  setInterval(async () => {
    bot.user.setActivity(prefix + 'help ' + `|| On ${bot.guilds.size} servers!`)
  }, 10000)

  // checks and sends an embed of the statistics from PewDiePie and T-Series youtube channels every 30 mins
  setInterval(async () => {
    let d = new Date()
    if ((d.getMinutes() === 30 && d.getSeconds() === 0) || (d.getMinutes() === 0 && d.getSeconds() === 0)) {
      let subServerID = '432893133874003968'
      let tSeriesId = 'UCq-Fj5jknLsUf-MWSy4_brA'
      let pewdiepieId = 'UC-lHJZR3Gqxm24_Vd_AJ5Yw'
      const pew = await snekfetch.get(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${pewdiepieId}&key=${googleValue}`)
      let pewCounter = pew.body.items[0].statistics.subscriberCount
      const tGay = await snekfetch.get(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${tSeriesId}&key=${googleValue}`)
      let tGayCounter = tGay.body.items[0].statistics.subscriberCount
      if (!bot.guilds.get(subServerID).channels.find(c => c.name === 'pewds-vs-tbad')) {
        await bot.guilds.get(subServerID).createChannel('pewds-vs-tbad', 'text')
      }
      let sendChannel = bot.guilds.get(subServerID).channels.find(c => c.name === 'pewds-vs-tbad')
      let leadingName
      let leadingIcon
      let leadingColor

      if (pewCounter / 10 > tGayCounter / 10) {
        leadingName = 'PewDiePie'
        leadingIcon = 'https://cdn.iconscout.com/icon/free/png-256/pewdiepie-282191.png'
        leadingColor = '#00c9e0'
      } else {
        leadingName = 'T-Bad'
        leadingIcon = 'https://pbs.twimg.com/profile_images/720159926723588096/E49B7GyJ_400x400.jpg'
        leadingColor = '#ff0000'
      }
      let subEmbed = new Discord.RichEmbed()
        .setAuthor(`${leadingName} is ahead!`, `${leadingIcon}`)
        .setTitle('Do your part here!')
        .setURL('https://www.youtube.com/user/PewDiePie?sub_confirmation=1')
        .setColor(leadingColor)
        .setThumbnail(leadingIcon)
        .setFooter('Remember to do your part boiiis')
        .setTimestamp()
        .addField(`THE SUBGAP: ${pewCounter - tGayCounter}`, '\u200B')
        .addField("PewDiePie's subcount:", pewCounter, true)
        .addField("T-Bad's subcount:", tGayCounter, true)
      sendChannel.send(subEmbed)
    }

    if (d.getMinutes() === 0 && d.getSeconds() === 0) {
      // define a channel to post the meme in
      let memeServerID = '432893133874003968'
      if (!bot.guilds.get(memeServerID).channels.find(c => c.name === '🤣migmig')) {
        await bot.guilds.get(memeServerID).createChannel('🤣migmig', 'text')
      }
      let sendChannel = bot.guilds.get(memeServerID).channels.find(c => c.name === '🤣migmig')
      // get the json version of the memes from r/dankmemes/top
      const { body } = await snekfetch.get('https://www.reddit.com/r/dankmemes/top.json?sort=top&t=24hours')
      const allowed = sendChannel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18)
      if (!allowed.length) return sendChannel.send('It seems we are out of fresh memes!, Try again later.')

      // take the top meme from the json and define it as the meme
      let number = 0
      let memeLogFile = require('./memelog.json')
      let theMeme = allowed[number].data
      do {
        theMeme = allowed[number].data
        // if the id isn't already in a local meme json file
        if (!memeLogFile.includes(theMeme.id)) {
          // log the meme id of the new meme in the json file
          memeLogFile.push(theMeme.id)
          fs.writeFile('./memelog.json', JSON.stringify(memeLogFile), (err) => {
            if (err) console.log(err)
          })

          break
        } else {
          // increment number
          number++
        }
      } while (true) // while the meme id is already in the local json file

      // make an embed and post the meme in the pre-defined server channel
      const embed = new Discord.RichEmbed()
        .setColor(0x00A2E8)
        .setTitle(theMeme.title)
        .setURL(`https://www.reddit.com${theMeme.permalink}`)
        .setDescription('Posted by: ' + theMeme.author)
        .setImage(theMeme.url)
        .setFooter(`👍 ${theMeme.ups} 💬 ${theMeme.num_comments}`)
      sendChannel.send(embed)
    }

    if (d.getHours() === 5 && d.getSeconds() === 0) {
      let cleanArray = []
      fs.writeFile('./memelog.json', JSON.stringify(cleanArray), (err) => {
        if (err) console.log(err)
      })
    }
  }, 1000)

  bot.setInterval(() => {
    for (let i in bot.mutes) {
      let time = bot.mutes[i].time
      let guildId = bot.mutes[i].guild
      let guild = bot.guilds.get(guildId)
      let member = guild.members.get(i)
      let mutedRole = guild.roles.find(r => r.name === 'Muted')
      let roleM = guild.roles.find(r => r.name === 'Medlem')
      if (!mutedRole) continue

      if (Date.now() > time && time != null) {
        console.log(`${i} id now able to be umnuted!`)

        member.removeRole(mutedRole)
        member.addRole(roleM)
        delete bot.mutes[i]

        fs.writeFile('./mutes.json', JSON.stringify(bot.mutes), err => {
          if (err) throw err
          console.log(`I have unmuted ${member.user.tag}.`)
        })
      }
    }
  }, 5000)
})

// Runs when the bot is disconnecting and sends information to the console:
bot.on('disconnect', () => console.log('I just disconnected, making sure you know, I will reconnect now...'))

// Runs then reconnecting and sends information to the console:
bot.on('reconnecting', () => console.log('I am reconnecting now!'))

// Sends an embed with new members joining the server:
bot.on('guildMemberAdd', async member => {
  if (!member.guild.channels.find(`name`, '📑medlems-log')) {
    await member.guild.createChannel('📑medlems-log', 'text')
  }
  let memberLogChannel = member.guild.channels.find(`name`, '📑medlems-log')

  let amEmbed = new Discord.RichEmbed()
    .setAuthor(`${member.user.username}#${member.user.discriminator} (ID: ${member.id})`, member.user.displayAvatarURL)
    .addField('Joining user:', `<@${member.user.id}>`)
    .setColor(botSettings.green)
    .setTimestamp()
  memberLogChannel.send(amEmbed)

  if (!member.guild.roles.find('name', 'Medlem')) {
    await member.guild.createRole({
      name: 'Member'
    })
  }

  var role = member.guild.roles.find('name', 'Medlem')
  member.addRole(role)
})

// Sends an embed with new members leaving the server:
bot.on('guildMemberRemove', async member => {
  console.log(member.guild)
  if (!member.guild.channels.find(`name`, '📑medlems-log')) {
    await member.guild.createChannel('📑medlems-log', 'text')
  }
  let memberLogChannel = member.guild.channels.find(`name`, '📑medlems-log')

  let amEmbed = new Discord.RichEmbed()
    .setAuthor(`${member.user.username}#${member.user.discriminator} (ID: ${member.id})`, member.user.displayAvatarURL)
    .addField('Leaving user:', `<@${member.user.id}>`)
    .setColor(botSettings.red)
    .setTimestamp()
  memberLogChannel.send(amEmbed)
})

// Logging the creation of channels:
bot.on('channelCreate', async channel => {
  const entry = await channel.guild.fetchAuditLogs({
    type: 'CHANNEL_CREATE'
  }).then(audit => audit.entries.first())
  if (entry.executor.bot === true) return

  if (!channel.guild.channels.find(c => c.name === 'server-log')) {
    await channel.guild.createChannel('server-log', 'text')
  }
  let logChannel = channel.guild.channels.find(c => c.name === 'server-log')

  let ccEmbed = new Discord.RichEmbed()
    .setTitle(`Channel "#${channel.name}" has been created by ${entry.executor.username}#${entry.executor.discriminator}!`)
    .setColor(botSettings.green)
    .addField('Channel:', channel, true)
    .addField('Created by:', `<@${entry.executor.id}>`, true)
    .setFooter(channel.createdAt, entry.executor.displayAvatarURL)
  return logChannel.send(ccEmbed)
})

// Logging the deletion of channels:
bot.on('channelDelete', async channel => {
  const entry = await channel.guild.fetchAuditLogs({
    type: 'CHANNEL_DELETE'
  }).then(audit => audit.entries.first())
  if (entry.executor.bot === true) return

  if (!channel.guild.channels.find(`name`, 'server-log')) {
    await channel.guild.createChannel('server-log', 'text')
  }
  let logChannel = channel.guild.channels.find(`name`, 'server-log')

  let cdEmbed = new Discord.RichEmbed()
    .setTitle(`Channel "#${channel.name}" has been deleted by ${entry.executor.username}#${entry.executor.discriminator}!`)
    .setColor(botSettings.red)
    .addField('Channel:', channel, true)
    .addField('Deleted by:', `<@${entry.executor.id}>`, true)
    .setTimestamp()
  logChannel.send(cdEmbed)
})

// Logging updates of members:
bot.on('guildMemberUpdate', async (oldMember, newMember) => {
  /*
  const entryO = await oldMember.guild.fetchAuditLogs({
    type: 'MEMBER_UPDATE'
  }).then(audit => audit.entries.first())

  const entryN = await newMember.guild.fetchAuditLogs({
    type: 'MEMBER_UPDATE'
  }).then(audit => audit.entries.first())
  */

  if (!oldMember.guild.channels.find(`name`, 'server-log')) {
    await oldMember.guild.createChannel('server-log', 'text')
  }
  let logChannel = oldMember.guild.channels.find(`name`, 'server-log')
  let joiningPoint = ` | `
  let findRolesOld = oldMember.roles.map(r => r).join(joiningPoint)
  let findRolesNew = newMember.roles.map(r => r).join(joiningPoint)

  let updateEmbed = new Discord.RichEmbed()
    .setTitle(`Changes to ${oldMember.user.username}#${oldMember.user.discriminator}`)

  if (oldMember._roles.length !== newMember._roles.length) {
    updateEmbed.setDescription(`Roles were changed for ${oldMember.user}`)
    updateEmbed.addField('Roles before:', `${findRolesOld}`)
    updateEmbed.addField('Roles now:', `${findRolesNew}`)
    if (oldMember._roles.length < newMember._roles.length) {
      updateEmbed.setColor(botSettings.green)
    } else {
      updateEmbed.setColor(botSettings.red)
    }
  }

  if (oldMember.nickname !== newMember.nickname) {
    let nikO = oldMember.nickname
    let nikN = newMember.nickname

    if (nikO == null) {
      nikO = oldMember.user.username
    }

    if (nikN == null) {
      nikN = newMember.user.username
    }

    updateEmbed.setDescription(`Nickname was changed for ${oldMember.user}`)
    updateEmbed.addField('Name before:', nikO)
    updateEmbed.addField('Name now:', nikN)
    updateEmbed.setColor(botSettings.purple)
  }
  logChannel.send(updateEmbed)
})

// Logging deletion of messages:
bot.on('messageDelete', async message => {
  if (message.channel === message.guild.channels.find(`name`, 'server-log')) return

  const entry = await message.guild.fetchAuditLogs({
    type: 'MESSAGE_DELETE'
  }).then(audit => audit.entries.first())
  if (message.author.id === bot.user.id) return
  let user = ''
  try {
    if (entry.extra.channel.id === message.channel.id &&
      (entry.target.id === message.author.id) &&
      (entry.createdTimestamp > (Date.now() - 5000)) &&
      (entry.extra.count >= 1)) {
      user = entry.executor
    } else {
      user = message.author
    }
  } catch (e) {
    console.log(e)
  }

  if (user.bot === true) return

  if (!message.guild.channels.find(`name`, 'server-log')) {
    await message.guild.createChannel('server-log', 'text')
  }
  let logChannel = message.guild.channels.find(`name`, 'server-log')

  let delMessage = message.content
  if (delMessage === '') {
    delMessage = 'There was no text in the message.'
  }

  if (delMessage.startsWith(`${prefix}level`) || delMessage.startsWith(`${prefix}clear`) || (user.id === undefined)) return

  let deleteEmbed = new Discord.RichEmbed()
    .setTitle('Message deleted')
    .setColor(botSettings.red)
    .addField('Deleted message:', delMessage, true)
    .addField('Deleted from:', `${message.channel}`, true)
    .addField('Deleted by:', `<@${user.id}>`)
    .setTimestamp()
  if (message.attachments.find(a => a) != null) {
    deleteEmbed.addField('Picture:', message.attachments.find(a => a).proxyURL)
  }

  // console.log(message.embeds)
  try {
    if (message.embeds !== [] && message.embeds.find(t => t).image != null) {
      console.log(message.embeds.find(t => t).image)
      deleteEmbed.addField('Picture from embed:', message.embeds.find(t => t).image.proxyURL)
    }
  } catch (e) {
    // console.log(e)
  }

  logChannel.send(deleteEmbed)
})

// Logging pins in all text channels:
bot.on('channelPinsUpdate', async (channel, time) => {
  if (!channel.guild.channels.find(`name`, 'server-log')) {
    await channel.guild.createChannel('server-log', 'text')
  }

  let addRemove = 'added or removed'

  let pinEmbed = new Discord.RichEmbed()
    .addField(`A pin has been ${addRemove}`, `A pin has been ${addRemove} in ${channel} - ${time}`)
    .setColor(botSettings.blue)

  let logChannel = channel.guild.channels.find(`name`, 'server-log')
  logChannel.send(pinEmbed)
})

// Activates different commands on different messages:
bot.on('message', async message => {
  if (message.author.bot) return
  if (message.channel.type === 'dm') return

  let prefixes = JSON.parse(fs.readFileSync('./prefixes.json', 'utf8'))

  if (!prefixes[message.guild.id]) {
    prefixes[message.guild.id] = {
      prefixes: botSettings.prefix
    }
  }

  let prefix = prefixes[message.guild.id].prefixes

  let messageArray = message.content.split(/\s+/g)
  let command = messageArray[0]
  let args = messageArray.slice(1)

  if (message.content.startsWith(defaultPrefix + 'reset_prefix')) {
    if (!message.member.hasPermission('MANAGE_GUILD')) return errors.noPerms(message, 'MANAGE_SERVER')

    let prefixes = JSON.parse(fs.readFileSync('./prefixes.json', 'utf8'))

    prefixes[message.guild.id] = {
      prefixes: defaultPrefix
    }

    fs.writeFile('./prefixes.json', JSON.stringify(prefixes), (err) => {
      if (err) console.log(err)
    })

    let pEmbed = new Discord.RichEmbed()
      .setColor(botSettings.orange)
      .setTitle('Prefix set!')
      .setDescription(`Set to: ${defaultPrefix}`)

    message.channel.send(pEmbed)
  }

  // YouTube part of bot
  const searchString = args.join(' ')
  const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : ''
  const serverQueue = queue.get(message.guild.id)

  if (message.content.startsWith(prefix + 'play')) {
    var url2 = args.join('_')
    var link = ''
    if (url2 === 'mission_impossible') link = 'https://www.youtube.com/watch?v=XAYhNHhxN0A'
    else if (url2 === 'mc') link = 'https://www.youtube.com/watch?v=CBbvpgr4Qb4'
    else if (url2 === 'cocaine') link = 'https://www.youtube.com/watch?v=1bSQfyYVNW8'
    else if (url2 === 'die') link = 'https://www.youtube.com/watch?v=kJVLSPxj43k'
    else if (url2 === 'james_bond') link = 'https://www.youtube.com/watch?v=ye8KvYKn9-0'
    else if (url2 === 'kazoo') link = 'https://www.youtube.com/watch?v=7eVO_3z-Lhc'
    else if (url2 === 'minecraft_theme') link = 'https://www.youtube.com/watch?v=cjQQ9JYGgTM'
    else if (url2 === '#1') link = 'https://www.youtube.com/watch?v=PfYnvDL0Qcw'
    else if (url2 === 'max') link = 'https://www.youtube.com/watch?v=wLuE_yvUO1U'
    else if (url2 === 'rollin') link = 'https://www.youtube.com/watch?v=CtwJvgPJ9xw'
    else if (url2 === 'hentai') link = 'https://www.youtube.com/watch?v=1ER67r8OCW8'
    else if (url2 === 'ocean_man') link = 'https://www.youtube.com/watch?v=tkzY_VwNIek'
    else if (url2 === 'kappa') link = 'https://www.youtube.com/watch?v=XpTZlXn3pxY'
    else if (url2 === 'anime') link = 'https://www.youtube.com/playlist?list=PLyIUbA7gq1Mp5aCinh7ClZ3KY-QtP1zrK'
    else if (url2 === 'chill' || url2 === 'code') link = 'https://www.youtube.com/watch?v=vAKtNV8KcWg'
    else if (url2 === 'chill2' || url2 === 'code2') link = 'https://www.youtube.com/watch?v=hHW1oY26kxQ'
    else if (url2 === 'ddak') link = 'https://www.youtube.com/playlist?list=PLNbz9Y6Tg2_z0e7H5RGQ0VaCqtejy-y2c'
    else if (url2 === 'maxdak' || url2 === 'sot') link = 'https://www.youtube.com/playlist?list=PL0cWlOyqP6_PKyS76fDsafkj_ho4KLmEA'
    else if (url2 === 'og' || url2 === 'OG') link = 'https://www.youtube.com/playlist?list=PLNbz9Y6Tg2_weCm_9ZE6OmJ0Mbag5e7AF'
    else if (url2 === 'lose_it' || url2 === 'lube_it') link = 'https://www.youtube.com/watch?v=TGaXcdvZ3qA'
    else return

    const voiceChannel = message.member.voiceChannel
    if (!voiceChannel) return message.channel.send("I'm sorry but you need to be in a voiceChannel to play music")

    if (link.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await youtube.getPlaylist(link)
      const videos = await playlist.getVideos()
      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id) // eslint-disable-line-no-await-in-loop
        await handleVideo(video2, message, voiceChannel, true) // eslint-disable-line-no-await-in-loop
      }
      return message.channel.send(`Playlist: **${playlist.title}** has been added to the queue!`)
    } else {
      try {
        var video = await youtube.getVideo(link)
      } catch (error) {
        try {
          var videos = await youtube.searchVideos(searchString, 1)
          video = await youtube.getVideoByID(videos[0].id)
        } catch (err) {
          console.log(err)
          return message.channel.send(`I could not obtain any search results`)
        }
      }
      return handleVideo(video, message, voiceChannel)
    }
  }

  if (message.content.startsWith(prefix + 'yt')) {
    const voiceChannel = message.member.voiceChannel
    if (!voiceChannel) return message.channel.send("I'm sorry but you need to be in a voiceChannel to play music")

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await youtube.getPlaylist(url)
      const videos = await playlist.getVideos()
      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id) // eslint-disable-line-no-await-in-loop
        await handleVideo(video2, message, voiceChannel, true) // eslint-disable-line-no-await-in-loop
      }
      return message.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`)
    } else {
      try {
        video = await youtube.getVideo(url)
      } catch (error) {
        try {
          message.channel.send(`<:YouTube:521795667392200716> Searching :mag_right: **${searchString}**`)
          videos = await youtube.searchVideos(searchString, 5)
          let index = 0
          message.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Please provide a value to select one of the 🔎 results ranging from **1-5**.`)
          try {
            var response = await message.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
              maxMatches: 1,
              time: 30000,
              errors: ['time']
            })
          } catch (err) {
            console.error(err)
            return message.channel.send('No or invalid value entered, cancelling video selection.')
          }
          const videoIndex = parseInt(response.first().content)
          video = await youtube.getVideoByID(videos[videoIndex - 1].id)
        } catch (err) {
          console.error(err)
          return message.channel.send('🆘 I could not obtain any search results.')
        }
      }
      return handleVideo(video, message, voiceChannel)
    }
  } else if (message.content.startsWith(prefix + 'skip')) {
    if (!message.member.voiceChannel) return message.channel.send("You're not in a voiceChannel!")
    if (!serverQueue) return message.channel.send('There is nothing playing that I could skip for you.')
    serverQueue.connection.dispatcher.end('Skip command has been used!')
    return undefined
  } else if (message.content.startsWith(prefix + 'stop')) {
    if (!message.member.voiceChannel) return message.channel.send("You're not in a voiceChannel!")
    if (!serverQueue) return message.channel.send('There is nothing playing that I could skip for you.')
    serverQueue.songs = []
    serverQueue.connection.dispatcher.end('Stop command has been used!')
    return undefined
  } else if (message.content.startsWith(prefix + 'volume')) {
    if (!message.member.voiceChannel) return message.channel.send("You're not in a voiceChannel!")
    if (!serverQueue) return message.channel.send('There is nothing playing.')
    if (!args[0]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`)
    serverQueue.volume = args[0]
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5)
    return message.channel.send(`I set the volume to **${args[0]}**`)
  } else if (message.content.startsWith(prefix + 'np')) {
    if (!serverQueue) return message.channel.send('There is nothing playing.')
    return message.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`)
  } else if (message.content.startsWith(prefix + 'queue')) {
    if (!serverQueue) return message.channel.send('There is nothing playing.')
    return message.channel.send(`
__**Song queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**Now playing:** ${serverQueue.songs[0].title}
`)
  } else if (message.content.startsWith(prefix + 'pause')) {
    if (!message.member.voiceChannel) return message.channel.send("You're not in a voiceChannel!")
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false
      serverQueue.connection.dispatcher.pause()
      return message.channel.send(`Paused the music for you!`)
    }
    return message.channel.send('There is nothing playing.')
  } else if (message.content.startsWith(prefix + 'resume')) {
    if (!message.member.voiceChannel) return message.channel.send("You're not in a voiceChannel!")
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true
      serverQueue.connection.dispatcher.resume()
      return message.channel.send(`Resumed the music for you!`)
    }
    return message.channel.send('There is nothing playing.')
  }
  // End of YouTube part of bot

  if (message.content.startsWith(prefix)) {
    let cmd = bot.commands.get(command.slice(prefix.length))
    if (cmd) cmd.run(bot, message, args, prefix, botSettings, serverQueue)
  } else {
    let xpAdd = Math.ceil(Math.random() * 3)
    let lucky = Math.ceil(Math.random() * 1000000)

    if (lucky === 42) {
      xpAdd = 10000
      let luckyOne = new Discord.RichEmbed()
        .setTitle('You are the lucky one!')
        .setColor(botSettings.gold)
        .addField('You have been granted extreme power', `${xpAdd} XP`)
      message.channel.send(luckyOne).then(msg => msg.delete(10000))
    } else if (args.length > 7 && args.length < 13) {
      xpAdd = Math.ceil(Math.random() * 7)
    } else if (args.length > 15) {
      xpAdd = Math.ceil(Math.random() * 15)
    }

    Level.findOne({
      userID: message.author.id,
      serverID: message.guild.id
    }, (err, xp) => {
      if (err) console.log(err)
      if (!xp) {
        const newXp = new Level({
          userID: message.author.id,
          serverID: message.guild.id,
          xp: xpAdd,
          level: 1
        })
        newXp.save().catch(err => console.log(err))
      } else if (xp) {
        xp.xp = xp.xp + xpAdd
        xp.save().catch(err => console.log(err))
      }
    })

    Level.findOne({
      userID: message.author.id,
      serverID: message.guild.id
    }, (err, level) => {
      if (err) console.log(err)
      if (!level) { }
      while (level.level * 300 <= level.xp) {
        level.level = level.level + 1
        level.save().catch(err => console.log(err))
        if (level.level * 300 >= level.xp) {
          let lvlup = new Discord.RichEmbed()
            .setTitle('Level Up!')
            .setColor(botSettings.purple)
            .addField('New Level', level.level)
          message.channel.send(lvlup).then(msg => msg.delete(5000))
        }
      }
    })
  }
})

// YouTube part of bot
// Function for handeling video from youtube:
async function handleVideo(video, message, voiceChannel, playlist = false) {
  const serverQueue = queue.get(message.guild.id)
  const song = {
    id: video.id,
    title: Util.escapeMarkdown(video.title),
    url: `https://www.youtube.com/watch?v=${video.id}`
  }
  if (!serverQueue) {
    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    }
    queue.set(message.guild.id, queueConstruct)
    queueConstruct.songs.push(song)
    try {
      var connection = await voiceChannel.join()
      queueConstruct.connection = connection
      play(message.guild, queueConstruct.songs[0])
    } catch (error) {
      console.error(`I could not join the voice channel: ${error}`)
      queue.delete(message.guild.id)
      return message.channel.send(`I could not join the voice channel: ${error}`)
    }
  } else {
    serverQueue.songs.push(song)
    console.log(serverQueue.songs)
    if (playlist) return undefined
    else return message.channel.send(`✅ **${song.title}** has been added to the queue!`)
  }
  return undefined
}

// Function for playing videos from youtube:
function play(guild, song) {
  const serverQueue = queue.get(guild.id)

  if (!song) {
    serverQueue.voiceChannel.leave()
    queue.delete(guild.id)
    return
  }
  const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
    .on('end', reason => {
      if (reason === 'Stream is not generating quickly enough.') console.log('Song ended')
      else console.log(reason)
      serverQueue.songs.shift()
      play(guild, serverQueue.songs[0])
    })
    .on('error', error => console.error(error))
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5)

  serverQueue.textChannel.send(`:church: :notes: Playing: **${song.title}** - now`)
}
// End of YouTube bot


bot.login(tokenValue)


module.exports = {
  // Exporting functions
  checkingTesting: checkingTesting,


  // Exporting variables
  testingSettings: testingSettings,
}
