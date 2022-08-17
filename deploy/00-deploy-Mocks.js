const { network } = require("hardhat");
const {
    developmentChains,
    DECIMAL,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config");
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    if (developmentChains.includes(network.name)) {
        //31337
        log("Local network Detected ", network.name);
        log(" I am deployer ", deployer);
        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMAL, INITIAL_ANSWER],
        });
        log("Mocks Deployed...");
        log("-------------------MOCKS-----------------------------------");
    }
};

module.exports.tags = ["all", "mocks"];
//yarn hardhat deploy --tags mocks :this will run script only deploy function which has these tags
