// solidity is a programming language that is synchronous
// javascript is a programming language that can be asynchronous
//      - remember `await` keyword can only be used in `async` functions

const ethers = require("ethers");
const fs = require("fs-extra");

async function main() {
  // http://127.0.0.1:7545
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:7545"
  );
  // the command below gives us access to wallet & its private keys so that transactions can be signed.
  const wallet = new ethers.Wallet("GANACHEBLOCKCHAIN-1PRIVATEKEYS", provider);
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );

  // in ethers, contract factory, is just an object where you can deploy contracts
  // abi is used so the code knows how to interact with the contract
  // binary is where the main compiled code is.
  // wallet is needed to sign transactions
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait ...");
  const contract = await contractFactory.deploy();
  console.log("Contract Deployed...");
  console.log(contract);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
