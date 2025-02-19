const { ethers } = require("hardhat");

async function main() {
    const ReverseDutchAuction = await ethers.getContractFactory("ReverseDutchAuction");
    const reverseDutchAuction = await ReverseDutchAuction.deploy();
    await reverseDutchAuction.waitForDeployment();
    console.log("ReverseDutchAuction contract deployed to:", reverseDutchAuction.target);

    const [owner] = await ethers.getSigners();

  const MyToken = await hre.ethers.getContractFactory("MyToken");

  const token = await MyToken.deploy();
  await token.waitForDeployment();

  console.log("Token contract deployed to:", await token.getAddress());


  const token2 = await MyToken.deploy();
  await token2.waitForDeployment();

  console.log("Token contract deployed to:", await token2.getAddress());


    const token1Address = await token.getAddress();

    const token2Address = await token2.getAddress();
    const amount = ethers.parseEther("10");
    const initialprice = ethers.parseEther("1");
    const duration = 60 * 60 * 24 * 7;
    const priceDecrement = ethers.parseEther("0.1");

    await token.approve(reverseDutchAuction.target, ethers.parseEther("100"));

    await reverseDutchAuction.connect(owner).createAuction(
        token1Address, token2Address, amount, initialprice, duration, priceDecrement);
    
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });