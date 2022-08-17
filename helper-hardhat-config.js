//We define which address we take for AggregatorV3Interface
//PriceFeed is mapped with chain ID
const networkConfig = {
    4: {
        name: "rinkeby",
        ethUSDPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    },
};
const developmentChains = ["hardhat", "localhost"];

const DECIMAL = 8;
const INITIAL_ANSWER = 200000000000;
module.exports = {
    networkConfig,
    developmentChains,
    DECIMAL,
    INITIAL_ANSWER,
};
