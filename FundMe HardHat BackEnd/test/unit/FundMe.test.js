const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");
describe("FundMe", async function () {
    let deployer, fundMe, mockV3Aggregator;
    const sendValue = ethers.utils.parseEther("1");
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        );
        //Deploy our fundMe contract using hardhat deploy
    });
    // console.log(fundMe, "s");
    describe("constructor", async function () {
        it("set the aggregator address correctly", async function () {
            const response = await fundMe.getPriceFeed();
            assert.equal(response, mockV3Aggregator.address);
        });
    });
    describe("fund", async function () {
        it("Fail if don't send enough ETH", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "Didn't send enough "
            );
        });
        it("Update the amount funded", async function () {
            await fundMe.fund({ value: sendValue });
            const response = await fundMe.getAddressToAmountFunded(deployer); //return the amount he sent
            assert.equal(response.toString(), sendValue.toString());
        });
        it("Add funder to array of funder", async function () {
            await fundMe.fund({ value: sendValue });
            const funder = await fundMe.getFunder(0);
            assert.equal(funder, deployer);
        });
    });
    describe("withdraw", async function () {
        beforeEach(async function () {
            await fundMe.fund({ value: sendValue });
        });
        it("Only owner can withdraw", async function () {
            const startingFundingBalance = await fundMe.provider.getBalance(
                fundMe.address
            );
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            );
            const transactionResponse = await fundMe.Withdraw();
            const transactionReceipt = await transactionResponse.wait(1);

            const endingFundingBalance = await fundMe.provider.getBalance(
                fundMe.address
            );
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            );

            //Calculate gas Cost =effectiveGasPrice * gasUsed
            const { gasUsed, effectiveGasPrice } = transactionReceipt;
            const gasCost = gasUsed.mul(effectiveGasPrice);

            assert.equal(endingFundingBalance, 0);
            assert.equal(
                startingFundingBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            );
        });
        it("allow us to withdraw from multiple accounts", async function () {
            const accounts = await ethers.getSigners();
            for (let i = 1; i < 6; i++) {
                const fundMeContract = await fundMe.connect(accounts[i]);
                await fundMeContract.fund({ value: sendValue });
            }

            const startingFundingBalance = await fundMe.provider.getBalance(
                fundMe.address
            );
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            );
            const transactionResponse = await fundMe.Withdraw();
            const transactionReceipt = await transactionResponse.wait(1);

            const endingFundingBalance = await fundMe.provider.getBalance(
                fundMe.address
            );
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            );

            //Calculate gas Cost =effectiveGasPrice * gasUsed
            const { gasUsed, effectiveGasPrice } = transactionReceipt;
            const gasCost = gasUsed.mul(effectiveGasPrice);

            assert.equal(endingFundingBalance, 0);
            assert.equal(
                startingFundingBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            );

            //Make sure funder are reset
            await expect(fundMe.getFunder(0)).to.be.reverted;
            for (let i = 1; i < 6; i++) {
                assert.equal(
                    await fundMe.getAddressToAmountFunded(accounts[i].address),
                    0
                );
            }
        });
        it("Only allow the owner to withdraw", async function () {
            const accounts = await ethers.getSigners();
            const attacker = accounts[1];
            const attackerContract = await fundMe.connect(attacker);
            await expect(attackerContract.Withdraw()).to.be.reverted;
            // await expect(attackerContract.Withdraw()).to.be.revertedWith(
            //     "FundMe__NotOwner"
            // );
        });
    });
});
