const { developmentChains } = require("../../helper-hardhat-config");
const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const { assert, expect } = require("chai");

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let deployer, fundMe;
          const sendValue = ethers.utils.parseEther("1");
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer;
              await deployments.fixture(["all"]);
              fundMe = await ethers.getContract("FundMe", deployer);
          });

          describe("fund", async function () {
              it("Fail if don't send enough ETH", async function () {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "Didn't send enough "
                  );
              });
              it("Update the amount funded", async function () {
                  await fundMe.fund({ value: sendValue });
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  ); //return the amount he sent
                  assert.equal(response.toString(), sendValue.toString());
              });
              it("Add funder to array of funder", async function () {
                  await fundMe.fund({ value: sendValue });
                  const funder = await fundMe.getFunder(0);
                  assert.equal(funder, deployer);
              });
          });
      });
