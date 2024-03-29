const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")

describe("FundMe", async function () {
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1")

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
            const response = await fundMe.s_priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    describe("fund", async function () {
        it("Fails if you don't send enough ETH", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        })
        it("Updated the amount funded data structure", async function () {
            await fundMe.fund({ value: sendValue })
            const response = await await fundMe.s_addressToAmountFunded(
                deployer
            )
            assert.equal(response.toString(), sendValue.toString())
        })

        it("Adds funder to array of s_funders", async function () {
            await fundMe.fund({ value: sendValue })
            const funder = await fundMe.s_funders(0)
            assert.equal(funder, deployer)
        })
    })

    describe("withdraw", async function () {
        // we want the contract to be funded before running this test, so include a beforeEach statement
        beforeEach(async function () {
            await fundMe.fund({ vaue: sendValue })
        })

        it("withdraw ETH from a single founder", async function () {
            // Arrange
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )
            // Act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )
            // Assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                // because startingFundMeBalance is from the blockchain, which will result in Big Number types (are objects)
                // Review solidity docs for more information.
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            )
        })

        it("allows us to withdraw with multiple s_funders", async function () {
            // Arrange
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                )
                fundMeConnectedContract.fund({ value: sendValue })
                const startingFundMeBalance = await fundMe.provider.getBalance(
                    fundMe.address
                )
                const startingDeployerBalance =
                    await fundMe.provider.getBalance(deployer)
            }
            // Act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            // Assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                // because startingFundMeBalance is from the blockchain, which will result in Big Number types (are objects)
                // Review solidity docs for more information.
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            )

            // Make sure that the s_funders are reset properly
            await expect(fundMe.s_funders(0)).to.be.reverted

            for (i = 1; i < 6; i++) {
                assert.equal(
                    await fundMe.s_addressToAmountFunded(accounts[i].address),
                    0
                )
            }
        })

        it("cheaperWithdraw testing ...", async function () {
            // Arrange
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                )
                fundMeConnectedContract.fund({ value: sendValue })
                const startingFundMeBalance = await fundMe.provider.getBalance(
                    fundMe.address
                )
                const startingDeployerBalance =
                    await fundMe.provider.getBalance(deployer)
            }
            // Act
            const transactionResponse = await fundMe.cheaperWithdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            // Assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                // because startingFundMeBalance is from the blockchain, which will result in Big Number types (are objects)
                // Review solidity docs for more information.
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            )

            // Make sure that the s_funders are reset properly
            await expect(fundMe.s_funders(0)).to.be.reverted

            for (i = 1; i < 6; i++) {
                assert.equal(
                    await fundMe.s_addressToAmountFunded(accounts[i].address),
                    0
                )
            }
        })
    })
})
