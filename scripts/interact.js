const { ethers } = require("hardhat");

async function main() {
    const ReverseDutchAuction = await ethers.getContractFactory("ReverseDutchAuction");
    const reverseDutchAuction = await ReverseDutchAuction.deploy();
    await reverseDutchAuction.waitForDeployment();
    console.log("ReverseDutchAuction contract deployed to:", reverseDutchAuction.target);


  const MyToken = await hre.ethers.getContractFactory("MyToken");

  const token = await MyToken.deploy();
  await token.waitForDeployment();

  console.log("Token contract deployed to:", await token.getAddress());


  const token2 = await MyToken.deploy();
  await token2.waitForDeployment();

  console.log("Token contract deployed to:", await token2.getAddress());


    const title = "Sample Event";
    const description = "This is a sample event.";
    const startDate = (await ethers.provider.getBlock("latest")).timestamp + 1000;
    const endDate = startDate + 10000;
    const eventType = 1;
    const expectedGuestCount = 100;
    const tokenURI = "https://ticket.com/jjj";

    const tx = await eventContract.createEvent(
        title,
        description,
        startDate,
        endDate,
        eventType,
        expectedGuestCount,
        tokenURI,
        ethers.parseEther("1")
    );
    await tx.wait();
    console.log("Event created!");

    const [owner, otherAccount] = await ethers.getSigners();
    const registerTx = await eventContract.connect(owner).registerForEvent(1);
    await registerTx.wait();
    console.log("User registered for the event!");

    const ticketPrice = ethers.parseEther("1");
    
    const confirmTx = await eventContract.connect(owner).confirmAttendance(1);
    await confirmTx.wait();
    console.log("Attendance confirmed!");
    
    console.log("purchasing ticket price")
    const purchaseTx = await eventContract.connect(owner).purchaseTicket(1, { value: ethers.parseEther("1") });
    await purchaseTx.wait();
    console.log("Ticket purchased!");

    
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });