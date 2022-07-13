// solidity is a programming language that is synchronous
// javascript is a programming language that can be asynchronous
//      - remember `await` keyword can only be used in `async` functions

const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  // http://127.0.0.1:7545
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  // the command below gives us access to wallet & its private keys so that transactions can be signed.
  //const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
  let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    process.env.PRIVATE_KEY_PASSWORD
  );
  wallet = await wallet.connect(provider);
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
  await contract.deployTransaction.wait(1);
  console.log("Contract Deployed...");
  // console.log(contract);
  // const transactionReceipt = await contract.deployTransaction.wait(1);
  // console.log("Here is the deployment transaction (transaction response): ");
  // console.log("---------------------------------");
  // console.log(contract.deployTransaction);
  // console.log("Here is the transaction receipt: ");
  // console.log("---------------------------------");
  // console.log(transactionReceipt);

  const currentFavoriteNumber = await contract.retrieve();
  // console.log(currentFavoriteNumber);
  console.log(`Current Favourite Number:  ${currentFavoriteNumber.toString()}`);
  const transactionResponse = await contract.store("7");
  const transactionReceipt = await transactionResponse.wait(1);
  const updatedFavouriteNumber = await contract.retrieve();

  console.log(
    `Updated Favourite Number is: ${updatedFavouriteNumber.toString()}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
