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
}
