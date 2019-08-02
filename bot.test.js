const { 
  // Functions
  checkingTesting,

  // Variables
  testing,
} = require('./bot')


test('checking to see if testing-mode is on', async () => {
  expect(checkingTesting(testing)).toBe('online');
});