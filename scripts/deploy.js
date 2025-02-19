const hre = require("hardhat");

async function main() {

    const ReverseDutchAuction = await hre.ethers.getContractFactory("ReverseDutchAuction");
    const reverseDutchAuction = await ReverseDutchAuction.deploy();


    await reverseDutchAuction.waitForDeployment();

    const address = await reverseDutchAuction.getAddress()


    console.log(
        `deployed to reverseDutchAuction address ${address.toString()}}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});