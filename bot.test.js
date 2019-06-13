const { 
  // Functions
  checkingTesting,

  // Variables
  testingSettings,
} = require('./bot')


test('checking to see if testing-mode is on', async () => {
  expect(checkingTesting(testingSettings, 'token')).toBe(process.env['token']);

  // const testSettings = require('./ignored_folder/ignoredsettings.json')
  // expect(checkingTesting(testingSettings, 'token')).toBe(testSettings['token']);
});