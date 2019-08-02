const { 
  // Functions
  checkingTesting,

  // Variables
  testingSettings,
} = require('./bot')


test('checking to see if testing-mode is on', async () => {
  const onlineSettings = require('./ignored_folder/ignoredsettings.json')
  expect(checkingTesting(testingSettings, 'BOT_TOKEN')).toBe(onlineSettings['BOT_TOKEN']);

  // const testSettings = require('./ignored_folder/ignoredsettings.json')
  // expect(checkingTesting(testingSettings, 'token')).toBe(testSettings['token']);
});