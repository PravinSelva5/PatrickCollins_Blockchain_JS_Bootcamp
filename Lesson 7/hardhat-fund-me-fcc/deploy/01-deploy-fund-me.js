// function deployFunc() {
//     console.log("Hi!")
// }

// module.exports.default = deployFunc

// module.exports = async (hre) => {
//      we're pulling the below variables from hre (hardhat runtime environment)
//      syntax is the same as:
//      hre.getNamedAccounts
//      hre.deployments
//     const { getNamedAccounts, deployments } = hre
// }

// THE ABOVE CAN BE SHRINKED TO THE FOLLOWING SYNTAX AS WELL
// An asynchronous nameless function

// this syntax allows you to extrapolate the module/function that you want to use from a file.
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // this allows us to extract data based off the chain that the user is on.
    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    // if the contract doesn't exist, we deploy a minimal version of
    // for our local testing.

    // What is mocking?
    // This is primarily used for unit testing. An object under test may have dependencies
    // on other objects. To isolate the behaviour of the object you want to replace the other
    // objects by mocks that simulate the behaviour of the real objects. This is useful if the
    // real objects are impractical to incorporate into the unit test.

    //  WHEN GOING FOR LOCALHOST OR HARDHAT NETWORK WE WANT TO USE A MOCK
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, // put price feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        // verify
        await verify(fundMe.address, args)
    }
    log("----------------------------------------------------------------")
}

module.exports.tags = ["all", "fundme"]
