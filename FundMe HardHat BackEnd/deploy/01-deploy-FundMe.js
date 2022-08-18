const {
    networkConfig,
    developmentChains,
    DECIMAL,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const { network } = require("hardhat");
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    // const ethUSDPriceFeed = networkConfig[chainId]["ethUSDPriceFeed"];
    let ethUSDPriceFeed;
    //Problem is :For localhost there is no priceFeed Link then how do we use it locally ?
    //Solution : Mocking  if the contract doesn't exist , we deploy a minimal version for our local testing
    if (developmentChains.includes(network.name)) {
        const ethUDSAggregator = await deployments.get("MockV3Aggregator");
        ethUSDPriceFeed = ethUDSAggregator.address;
    } else {
        log("networkgConfig", networkConfig);
        log("id", chainId);
        log("Netid", networkConfig[chainId]);
        console.log(networkConfig[chainId]["ethUSDPriceFeed"]);
        ethUSDPriceFeed = networkConfig[chainId]["ethUSDPriceFeed"];
    }
    const args = [ethUSDPriceFeed];
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmation || 1,
    });
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args);
    }

    log("------------------------------------FUND ME DEPLOY---------------");
};
module.exports.tags = ["all", "fundMe"];
