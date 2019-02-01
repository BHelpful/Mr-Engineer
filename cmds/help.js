const Discord = module.require('discord.js')

module.exports.run = async (bot, message, args, prefix, botSettings) => {
  var help = args.join('_')

  let checkEmbed = new Discord.RichEmbed()
    .setTitle(":mailbox_with_mail: Check your DM's")
    .setColor(botSettings.green)

  if (help === '') {
    let generalEmbed = new Discord.RichEmbed()
      .setTitle('General commands:')
      .setDescription(`Here is a list of the general commands!`)
      .setColor('#9B59B6')
      .addField('Prefix: ' + prefix, '\u200B')
      .addField(prefix + 'help', `Gives a list of all the commands.`)
      .addField(prefix + 'report <MENTION USER + REASON>', `Reports mentioned user with the given reason.`)
      .addField(prefix + 'avatar <MENTION USER>', `Generates an avatar of you or the user mentioned.`)
      .addField(prefix + 'doggo', `Generates an image of a random doggo.`)
      .addField(prefix + 'cat', `Generates an image of a random cat.`)
      .addField(prefix + 'level <MENTION USER>', `Gets the level of the user or user mentioned.`)
      .addField(prefix + '8ball <QUISTION>', `Ask the ball a question and gets an answer back.`)
      .addField(prefix + 'urban <WORD>', `Makes an Urban Dictionary search a word.`)
      .addField(prefix + 'random urban', `Makes a random Urban Dictionary search.`)
      .addField(prefix + 'serverinfo', `Gives a list of information of the server`)
      .addField(prefix + 'invite', `Generates an invite for the bot.`)
      .addField(prefix + 'ping', `Pings the bot.`)
      .addField(prefix + 'getnsfw', `Gives you the role NSFW.`)
      .addField(prefix + 'removensfw', `Removes the role NSFW.`)
      .addField(prefix + 'userinfo <USER>', `Gives a list of information of you or the user mentioned.`)

    let musicEmbed = new Discord.RichEmbed()
      .setTitle('Music commands:')
      .setDescription(`Here is a list of the commands for controlling the music!`)
      .setColor('#a8f00e')
      .addField('Prefix: ' + prefix, '\u200B')
      .addField(prefix + 'join', `Joins the user's voicechannel.`)
      .addField(prefix + 'leave', `Leaves the user's voicechannel.`)
      .addField(prefix + 'yt <LINK> or <SEARCH_TAG> or <LINK TO PLAYLIST>', `Plays the youtube videos or adds them to queue.`)
      .addField(prefix + 'skip', `Skips the current song in the queue`)
      .addField(prefix + 'volume <VALUE>', `Shows the volume or changes it to chosen value.`)
      .addField(prefix + 'np', `Shows the title of the song playing.`)
      .addField(prefix + 'queue', `Shows the queue, if it is short enough.`)
      .addField(prefix + 'pause', `Pauses the music.`)
      .addField(prefix + 'resume', `Resumes the music`)
      .addField(prefix + 'stop', `Stops the music from youtube.`)

    let adminEmbed = new Discord.RichEmbed()
      .setTitle('Admin commands:')
      .setDescription(`Here is a list of the commands for admins!`)
      .setColor('#f00e0e')
      .addField('Prefix: ' + prefix, '\u200B')
      .addField(prefix + 'setprefix <NEW DESIRED PREFIX>', `Changes the prefix for the bot.`)
      .addField(prefix + 'kick <MENTION USER + REASON>', `Kicks mentioned user with the given reason.`)
      .addField(prefix + 'ban <MENTION USER + REASON>', `Bans mentioned user with the given reason.`)
      .addField(prefix + 'trust <MENTION USER>', `Trusts the mentioned user by giving them the role Trusted.`)
      .addField(prefix + 'mute <MENTION USER>', `Mutes the mentioned user.`)
      .addField(prefix + 'unmute <MENTION USER>', `Unmutes the mentioned user.`)
      .addField(prefix + 'addrole <MENTION USER>', `Adds selected role to mentioned user.`)
      .addField(prefix + 'clear <AMOUNT>', `Deletes number of messages selected in the chat.`)

    let serverEmbed = new Discord.RichEmbed()
      .setTitle('Server commands:')
      .setDescription(`Commands for the server GOOD SHIT!`)
      .setColor('#620388')
      .addField('Prefix: ' + prefix, '\u200B')
      .addField(prefix + 'help music', `Gives a list of all music commands!`)

    let member = message.member
    let serverID1 = '432893133874003968' || '453202034489819166' || '498047151377612800'
    let serverID2 = '453202034489819166'
    let serverID3 = '498047151377612800'

    message.author.send(generalEmbed)
    message.author.send(musicEmbed)
    message.channel.send(checkEmbed).then(m => m.delete(5000))
    if (member.hasPermission(['ADMINISTRATOR', 'MANAGE_GUILD'])) {
      message.author.send(adminEmbed)
    }
    if (message.guild.id === serverID1 || message.guild.id === serverID2 || message.guild.id === serverID3) {
      message.author.send(serverEmbed)
    }
  } else if (help === 'music') {
    var prefixMusic = prefix + 'play' + ' '
    let embed = new Discord.RichEmbed()
      .setAuthor('Utility bot')
      .setDescription('Here is a list of the commands!')
      .setColor('#9B59B6')
      .addField('Prefix: ' + prefixMusic, 'Fx: ' + prefixMusic + 'kazoo')
      .addBlankField()
      .addField(prefixMusic + 'mc', `Plays: "Meme Circus | MajorLeagueWobs/Holder [Extended Version]"`)
      .addField(prefixMusic + 'kazoo', `Plays: "Kazoo Kid - Mike Diva Trap Remix [EXTENDED]"`)
      .addField(prefixMusic + 'die', `Plays: "ISIS Song Saleel Sawarim Presidential Sing Along Parody"`)
      .addField(prefixMusic + 'cocaine', `Plays: "Cocaine dinosaur- power rangers"`)
      .addField(prefixMusic + 'james bond', `Plays: "James Bond 007 Theme Tune (original)"`)
      .addField(prefixMusic + 'minecraft theme', `Plays: "Minecraft-Theme Song {Extended for 30 Minutes}"`)
      .addField(prefixMusic + 'mission impossible', `Plays: "Mission Impossible Theme(full theme)"`)
      .addField(prefixMusic + 'max', `Plays: "Frequencerz - The Unknown (Two Steps from Hell - Heart of Courage REMIX)(Bass Boosted)(HD)"`)
      .addField(prefixMusic + '#1', `Plays: "Lazy Town | We are Number One Music Video"`)
      .addField(prefixMusic + 'hentai', `Plays: [UK hardcore] hentai S3RL`)
      .addField(prefixMusic + 'ocean man', `Plays: Ween - Ocean Man [Music Video]`)
      .addField(prefixMusic + 'kappa', `Plays: R3Z - Hey Kappa Kappa (Studio Version)`)
      .addField(prefixMusic + 'rollin', `Plays: "Chamillionaire - Ridin' ft. Krayzie Bone"`)
      .addField(prefixMusic + '[chill] or [code]', `Plays: "Code Radio 🎧 + 💻 24/7 concentration music for programmers 🔥 jazzy beats from freeCodeCamp.org"`)
      .addField(prefixMusic + '[chill2] or [code2]', `lofi hip hop radio - beats to relax/study to`)
      .addField(prefixMusic + '[og] or [OG]', `Plays: "OG playlist"`)
      .addField(prefixMusic + 'ddak', `Plays: "DDAK playlist"`)
      .addField(prefixMusic + '[maxdak] og [sot]', `Plays: "State of trans playlist"`)
      .addField(prefixMusic + 'anime', `Plays: "Amine playlist (Alex')"`)
      .addField(prefixMusic + '[lube it] or [lose it]', `Plays "♂ Eminem - Just Lube It ♂"`)

    let serverID1 = '432893133874003968'
    let serverID2 = '453202034489819166'
    let serverID3 = '498047151377612800'
    let serverID4 = '340458256701063168'

    if (message.guild.id === serverID1 || message.guild.id === serverID2 || message.guild.id === serverID3 || message.guild.id === serverID4) {
      message.author.send(embed)
      message.channel.send(checkEmbed).then(m => m.delete(5000))
    }
  }
}

module.exports.help = {
  name: 'help'
}
