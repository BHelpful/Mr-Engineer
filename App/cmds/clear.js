const errors = require('../utils/errors.js')

module.exports.run = async (client, message, args, prefix) => {
  if (!message.member.hasPermission('MANAGE_MESSAGES')) return errors.noPerms(message, 'MANAGE_MESSAGES')
  if (!args[0]) return message.channel.send('oof')

  let amt = args[0]

  if (amt === 1) return message.reply('-clear needs to be more than 1 message!')

  message.delete().then(() => {
    try {
      message.channel.bulkDelete(amt).then(() => {
        message.channel.send(`${amt} messages were successfully deleted!`).then(m => m.delete(2000))
      })
    } catch (e) {
      console.log(e)
    }
  })
}

module.exports.help = {
  name: 'clear'

}
