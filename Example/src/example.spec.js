describe('Bing search', () => {
    test({
      title: 'Search Ringcentral and check the result include Ringcentral',
    }, async ({ page }) => {
      await $(page).type('@b_searchbox', 'RingCentral');
      await $(page).click('@b_searchboxSubmit');
      const firstResultText = await $(page).getText('@b_algo');
      await $(page).waitFor(5000);
      console.log(`--> result: ${firstResultText}`);
      expect(firstResultText).toMatch('RingCentral');
    });
});