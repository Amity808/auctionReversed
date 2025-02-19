const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  
  describe("ReverseDutchAuction", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployOneYearLockFixture() {
      
      // Contracts are deployed using the first signer/account by default
      const [owner, otherAccount] = await ethers.getSigners();
  
      const ReverseDutchAuction = await ethers.getContractFactory("ReverseDutchAuction");
      const reverseDutchAuction = await Lock.deploy();

      const MyToken = await hre.ethers.getContractFactory("MyToken");
        const saleToken = await MyToken.deploy();
        const paymentToken = await MyToken.deploy();
  
      await saleToken.mint(seller.address, ethers.utils.parseUnits("100", 18));
    await paymentToken.mint(buyer.address, ethers.utils.parseUnits("1000", 18));
      return { reverseDutchAuction, owner, otherAccount };
    }


  
    
  });
  