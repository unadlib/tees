describe('Default page', () => {
  test({
    title: 'check text include "Learn React" in default page',
  }, async ({ page }) => {
    const text = await $(page).getText('@App-link');
    expect(text).toEqual('Learn React');
  });
});
