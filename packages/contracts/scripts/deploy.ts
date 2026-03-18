import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy LobsterToken (Governance)
  console.log("\n--- Deploying LobsterToken ---");
  const LobsterToken = await ethers.getContractFactory("LobsterToken");
  const lobster = await LobsterToken.deploy(
    deployer.address, // treasury (temp)
    deployer.address, // communityAirdrop (temp)
    deployer.address, // team (temp)
    deployer.address  // partners (temp)
  );
  await lobster.waitForDeployment();
  const lobsterAddress = await lobster.getAddress();
  console.log("LobsterToken deployed to:", lobsterAddress);

  // Deploy PearlToken (Game)
  console.log("\n--- Deploying PearlToken ---");
  const PearlToken = await ethers.getContractFactory("PearlToken");
  const pearl = await PearlToken.deploy(
    deployer.address,
    ethers.parseEther("10000000"), // 10M initial supply
    ethers.parseEther("100000")    // 100K daily cap
  );
  await pearl.waitForDeployment();
  const pearlAddress = await pearl.getAddress();
  console.log("PearlToken deployed to:", pearlAddress);

  // Deploy CoralToken (Impact)
  console.log("\n--- Deploying CoralToken ---");
  const CoralToken = await ethers.getContractFactory("CoralToken");
  const coral = await CoralToken.deploy(deployer.address);
  await coral.waitForDeployment();
  const coralAddress = await coral.getAddress();
  console.log("CoralToken deployed to:", coralAddress);

  // Deploy LobsterNFT
  console.log("\n--- Deploying LobsterNFT ---");
  const LobsterNFT = await ethers.getContractFactory("LobsterNFT");
  const lobsterNFT = await LobsterNFT.deploy();
  await lobsterNFT.waitForDeployment();
  const lobsterNFTAddress = await lobsterNFT.getAddress();
  console.log("LobsterNFT deployed to:", lobsterNFTAddress);

  // Deploy ItemNFT
  console.log("\n--- Deploying ItemNFT ---");
  const ItemNFT = await ethers.getContractFactory("ItemNFT");
  const itemNFT = await ItemNFT.deploy();
  await itemNFT.waitForDeployment();
  const itemNFTAddress = await itemNFT.getAddress();
  console.log("ItemNFT deployed to:", itemNFTAddress);

  // Deploy BattleArena
  console.log("\n--- Deploying BattleArena ---");
  const BattleArena = await ethers.getContractFactory("BattleArena");
  const arena = await BattleArena.deploy(pearlAddress, itemNFTAddress);
  await arena.waitForDeployment();
  const arenaAddress = await arena.getAddress();
  console.log("BattleArena deployed to:", arenaAddress);

  // Setup permissions
  console.log("\n--- Setting up permissions ---");
  
  const GAME_ROLE = ethers.keccak256(ethers.toUtf8Bytes("GAME_ROLE"));
  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));

  await pearl.addGameContract(arenaAddress);
  console.log("Added arena as game contract for Pearl");

  await itemNFT.grantRole(MINTER_ROLE, arenaAddress);
  console.log("Granted minter role for ItemNFT to arena");

  console.log("\n=== Deployment Complete ===");
  console.log("LOBSTER (Governance):", lobsterAddress);
  console.log("PEARL (Game):", pearlAddress);
  console.log("CORAL (Impact):", coralAddress);
  console.log("LobsterNFT:", lobsterNFTAddress);
  console.log("ItemNFT:", itemNFTAddress);
  console.log("BattleArena:", arenaAddress);

  // Save to file
  const fs = require("fs");
  const deployment = {
    network: (await deployer.provider.getNetwork()).name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      LobsterToken: lobsterAddress,
      PearlToken: pearlAddress,
      CoralToken: coralAddress,
      LobsterNFT: lobsterNFTAddress,
      ItemNFT: itemNFTAddress,
      BattleArena: arenaAddress,
    }
  };
  
  fs.writeFileSync("deployment.json", JSON.stringify(deployment, null, 2));
  console.log("\nDeployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
