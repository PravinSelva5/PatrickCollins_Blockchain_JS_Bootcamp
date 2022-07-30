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
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // What is mocking?
    // This is primarily used for unit testing. An object under test may have dependencies
    // on other objects. To isolate the behaviour of the object you want to replace the other
    // objects by mocks that simulate the behaviour of the real objects. This is useful if the
    // real objects are impractical to incorporate into the unit test.

    //  WHEN GOING FOR LOCALHOST OR HARDHAT NETWORK WE WANT TO USE A MOCK

    const fundMe = await deploy("FundMe")
}
