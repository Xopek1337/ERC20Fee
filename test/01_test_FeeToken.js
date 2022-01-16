const { expect } = require('chai');
const { ethers } = require('hardhat');
const {
  ethers: {
    BigNumber,
  },
} = require("hardhat");

describe('feeTokenTest', () => {
  let owner, tokenOwner, wallet, user1;
  let feeToken;
  
  beforeEach(async () => {
    [owner, tokenOwner, wallet, user1] = await ethers.getSigners();
  });

  describe("Constructor", () => {
    it('Check values', async () => {
      const feeTokenInstance = await ethers.getContractFactory('FeeToken');

      feeToken = await feeTokenInstance.deploy(
        tokenOwner.address,
        wallet.address,
        process.env.TOKEN_NAME,
        process.env.TOKEN_SYMBOL,
        process.env.TOTAL_SUPPLY
      );

      const [ownerAddress, walletAddress, name, symbol] = await Promise.all([
        feeToken.owner(),
        feeToken.wallet(),
        feeToken.name(),
        feeToken.symbol(),
      ]);

      const tokenOwnerBalance = await feeToken.balanceOf(tokenOwner.address);
      const fee = await feeToken.fee();
      const denom = await feeToken.denom();

      expect(walletAddress).to.be.equal(wallet.address);
      expect(name).to.be.equal(process.env.TOKEN_NAME);
      expect(symbol).to.be.equal(process.env.TOKEN_SYMBOL);
      expect(tokenOwnerBalance).to.equal(process.env.TOTAL_SUPPLY);
      expect(fee).to.equal(25);
      expect(denom).to.equal(10000);
      expect(ownerAddress).to.equal(owner.address);
    });
  });

  describe("Other tests", () => {
    beforeEach(async () => {
      const feeTokenInstance = await ethers.getContractFactory('FeeToken');

      feeToken = await feeTokenInstance.deploy(
        tokenOwner.address,
        wallet.address,
        process.env.TOKEN_NAME,
        process.env.TOKEN_SYMBOL,
        process.env.TOTAL_SUPPLY
      );
    });

    it('should transfer', async () => {
      let amount = await BigNumber.from("100000");
      let fee = 25;
      let denom = 10000;
      let feeAmount = amount.mul(fee).div(denom);
      let net = amount.sub(feeAmount);

      const startOwnerTokensBalance = await feeToken.balanceOf(tokenOwner.address);
      const startWalletBalance = await feeToken.balanceOf(wallet.address);
      const startRecipientBalance = await feeToken.balanceOf(user1.address);

      let tx = await feeToken.connect(tokenOwner).transfer(user1.address, amount);

      const endingOwnerTokensBalance = await feeToken.balanceOf(tokenOwner.address);
      const endingWalletBalance = await feeToken.balanceOf(wallet.address);
      const endingRecipientBalance = await feeToken.balanceOf(user1.address);

      expect(startOwnerTokensBalance.sub(amount)).to.equal(endingOwnerTokensBalance);
      expect(startWalletBalance.add(feeAmount)).to.equal(endingWalletBalance);
      expect(startRecipientBalance.add(net)).to.equal(endingRecipientBalance);

      expect(tx).to.emit(feeToken, "Transfer").withArgs(tokenOwner.address, user1.address, net);
      expect(tx).to.emit(feeToken, "Transfer").withArgs(tokenOwner.address, wallet.address, feeAmount);
    });

    it('should set a new fee', async () => {
      const oldFee = await feeToken.fee();
      const newFee = 21;

      const tx = await feeToken._setFee(newFee);
      const newFeeValue = await feeToken.fee();

      expect(newFee).to.equal(newFeeValue);
      expect(tx).to.emit(feeToken, "NewFee").withArgs(oldFee, newFee);
    });

    it('should not set a new fee (only owner)', async () => {
      const newFee = 0;

      await expect(
        feeToken.connect(user1)._setFee(newFee)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('should failed (new fee must be less than the current fee)', async () => {
      const newFee = 26;

      await expect(
        feeToken._setFee(newFee),
      ).to.be.revertedWith('FeeToken::_setFee: The newFee_ must be less than the current fee');
    });

    it('should set a new wallet', async () => {
      const oldWallet = await feeToken.wallet();
      const walletAddress = user1.address;

      const tx = await feeToken._setWallet(walletAddress);
      // check tx is success
      const newWallet = await feeToken.wallet();

      expect(newWallet).to.equal(walletAddress);
      expect(tx).to.emit(feeToken, "NewWallet").withArgs(oldWallet, newWallet);
    });

    it('should not set a new wallet (only owner)', async () => {
      await expect(
        feeToken.connect(user1)._setWallet(user1.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });
});
