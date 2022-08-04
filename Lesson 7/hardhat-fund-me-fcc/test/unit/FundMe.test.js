const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")

describe("FundMe", async function () {
    let fundMe
    let deployer
    let mockV3Aggregator

    beforeEach(async function () {
        // deploy fundMe contract using hardhat-deploy
        // fixture allows us to run our deploy folder with as many tags as we would like
        const accounts = await ethers.getSigners()
        const accountZero = accounts[0]
        deployer = (await getNamedAccounts()).deployer
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
    })

    describe("constructor", async function () {
        it("sets the aggregator addresses correctly", async function () {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    describe("fund", async function () {
        it("Fails if you don't send enough ETH", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        })
    })
})
