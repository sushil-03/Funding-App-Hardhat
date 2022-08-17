//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConvertor {
    function getPrice(AggregatorV3Interface priceFeed)
        internal
        view
        returns (uint)
    {
        //Address  0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        //ABI
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint(price); //
    }

    function getConversion(uint ethAmount, AggregatorV3Interface priceFeed)
        internal
        view
        returns (uint)
    {
        uint ethPrice = getPrice(priceFeed);
        uint ethAmountInUSD = (ethPrice * ethAmount) / 1e8;
        return ethAmountInUSD;
    }
}
