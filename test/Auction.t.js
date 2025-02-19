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
  async function deployedReverseDutchAuction() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount, seller, buyer] = await ethers.getSigners();

    const ReverseDutchAuction = await ethers.getContractFactory(
      "ReverseDutchAuction"
    );
    const reverseDutchAuction = await ReverseDutchAuction.deploy();

    const MyToken = await hre.ethers.getContractFactory("MyToken");
    const saleToken = await MyToken.deploy();
    const paymentToken = await MyToken.deploy();

    await paymentToken.mint(otherAccount.address, ethers.parseUnits("10000000", 18));
    await saleToken.mint(owner.address, ethers.parseUnits("1000000", 18));

    const token1Address = await saleToken.getAddress();
    const token2Address = await paymentToken.getAddress();
    return {
      reverseDutchAuction,
      owner,
      otherAccount,
      saleToken,
      paymentToken,
      token1Address, 
      token2Address
    };
  }

  describe("Deployment", async () => {
    it("Should deploy the ReverseDutchAuction contract", async () => {
        const { reverseDutchAuction, saleToken,
            paymentToken, seller, buyer} = await loadFixture(
            deployedReverseDutchAuction
        );
        expect(reverseDutchAuction.address).to.not.be.null;
    })
    it("Should create and execute auction", async function() {
        // Seller creates auction
        const { reverseDutchAuction, owner, saleToken,
            paymentToken, seller, buyer, token1Address, otherAccount,
            token2Address} = await loadFixture(
            deployedReverseDutchAuction
        );
        const amount = ethers.parseUnits("10", 18);
        await saleToken.approve(reverseDutchAuction.target, amount);
        
        expect(
            await reverseDutchAuction.connect(owner).createAuction(
                token1Address,
                token2Address,
                amount,
                ethers.parseUnits("1", 18),
                3600, // 1 hour
                ethers.parseUnits("0.000277778", 18) // 1/hour decrease rate
              )
          
        ).to.emit(reverseDutchAuction, "AuctionCreated");
       

        //Buyer executes swap
        // const requiredPayment = ethers.parseUnits("10", 18);
        // await paymentToken.approve(reverseDutchAuction.target, requiredPayment);
        
        // await expect(reverseDutchAuction.connect(otherAccount).swapExcution(0))
        //   .to.emit(reverseDutchAuction, "AuctionExecuted");
      });
      it("Should revert with Invalid_Price", async function() {
        // Seller creates auction
        const { reverseDutchAuction, owner, saleToken,
            paymentToken, seller, buyer, token1Address, otherAccount,
            token2Address} = await loadFixture(
            deployedReverseDutchAuction
        );
        const amount = ethers.parseUnits("10", 18);
        await saleToken.approve(reverseDutchAuction.target, amount);
        
       await expect(
             reverseDutchAuction.connect(owner).createAuction(
                token1Address,
                token2Address,
                amount,
                ethers.parseUnits("0", 18),
                3600, // 1 hour
                ethers.parseUnits("0.000277778", 18) // 1/hour decrease rate
              )
          
        ).to.revertedWithCustomError(reverseDutchAuction, "Invalid_Price");
       

       
      });

      it("Should revert with Invalid_Amount", async function() {
        // Seller creates auction
        const { reverseDutchAuction, owner, saleToken,
            paymentToken, seller, buyer, token1Address, otherAccount,
            token2Address} = await loadFixture(
            deployedReverseDutchAuction
        );
        const amount = ethers.parseUnits("0", 18);
        await saleToken.approve(reverseDutchAuction.target, amount);
        
       await expect(
             reverseDutchAuction.connect(owner).createAuction(
                token1Address,
                token2Address,
                amount,
                ethers.parseUnits("1", 18),
                3600, // 1 hour
                ethers.parseUnits("0.000277778", 18) // 1/hour decrease rate
              )
          
        ).to.revertedWithCustomError(reverseDutchAuction, "Invalid_Amount");
       

       
      });

      it("it Should pass execute auction", async function() {
        // Seller creates auction
        const { reverseDutchAuction, owner, saleToken,
            paymentToken, seller, buyer, token1Address, otherAccount,
            token2Address} = await loadFixture(
            deployedReverseDutchAuction
        );
        const amount = ethers.parseUnits("10", 18);
        await saleToken.approve(reverseDutchAuction.target, amount);
        
        expect(
            await reverseDutchAuction.connect(owner).createAuction(
                token1Address,
                token2Address,
                amount,
                ethers.parseUnits("1", 18),
                3600, // 1 hour
                ethers.parseUnits("0.000277778", 18) // 1/hour decrease rate
              )
          
        ).to.emit(reverseDutchAuction, "AuctionCreated");
       

        //Buyer executes swap
        // const requiredPayment = ethers.parseUnits("10", 18);
        // await paymentToken.approve(reverseDutchAuction.target, requiredPayment);
        
        // await expect(reverseDutchAuction.connect(otherAccount).swapExcution(0))
        //   .to.emit(reverseDutchAuction, "AuctionExecuted");
      });
  })
});
