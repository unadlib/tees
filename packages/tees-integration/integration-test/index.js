describe('Bing search', () => {
  test({
    title: 'Search Ringcentral and check the result include Ringcentral',
  }, async ({ page }) => {
    const text = await $(page).getText('@App-link');
    expect(text).toMatch('Learn React');
  });
});
