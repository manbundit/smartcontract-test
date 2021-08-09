const SocialMedia = artifacts.require("SocialMedia");

contract('SocialMedia', (accounts) => {
  it('should add post with content and owner id correctly', async () => {
    const instance = await SocialMedia.deployed();

    await instance.createPost('post content', { from: accounts[1] })
    const post = await instance.posts(1)

    assert.equal(post.content, 'post content');
    assert.equal(post.owner, accounts[1]);
  })
  it('should add balance in to post owner when donate', async () => {
    const instance = await SocialMedia.deployed();

    await instance.createPost('post content', { from: accounts[1] })
    await instance.posts(1)
    await instance.donate(1, { from: accounts[2], value: 10000000 })
    const balance = (await instance.balances(accounts[1])).toNumber()

    assert.equal(balance, 10000000)
  });
  it('shoud deduct 10% of withdrawal amount to owner wallet when withdraw', async () => {
    const instance = await SocialMedia.deployed();

    const ownerAccountBalance = +(await web3.eth.getBalance(accounts[0]))
    await instance.createPost('post content', { from: accounts[1] })
    await instance.donate(1, { from: accounts[2], value: 1000000000 })

    await instance.withdraw(50000000, { from: accounts[1] })

    const ownerAccountEndingBalance = +(await web3.eth.getBalance(accounts[0]))

    assert.equal(ownerAccountBalance + (50000000 * 10 / 100), ownerAccountEndingBalance)
  });
  // it('shoud send ETH to contract owner when donate', async () => {
  //   const instance = await SocialMedia.deployed();

  //   const ownerAccountBalance = +(await web3.eth.getBalance(accounts[0]))
  //   await instance.createPost('post content', { from: accounts[1] })
  //   await instance.donate(1, { from: accounts[2], value: 1000000000 })
  //   const ownerAccountEndingBalance = +(await web3.eth.getBalance(accounts[0]))

  //   assert.equal(ownerAccountBalance + 1000000000, ownerAccountEndingBalance)
  // });
});
