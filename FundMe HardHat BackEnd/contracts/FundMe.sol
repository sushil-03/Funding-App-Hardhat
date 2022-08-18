/*
    Aim
    1.Get fund from user
    2.Withdraw fund
    3.set a minimum funding value in USD
*/
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "./PriceConvertor.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
//Custom error are also way of reducing gas

error FundMe__NotOwner();

/**  @title Contract for crowd funding
 * @author Sushil Boss
 * @notice Demo
 */
contract FundMe {
    //Type declaration
    using PriceConvertor for uint256;

    //State Variables
    address[] private s_funders;
    address private immutable i_owner; //One time initialization
    AggregatorV3Interface private s_priceFeed;
    mapping(address => uint256) private s_addressToAmountFunded;
    uint public constant MINIMUM_USD = 50 * 1e18; //Miniumum amount in usd

    //Modifier
    modifier onlyOwner() {
        // require(msg.sender==i_owner,"Sender is not owner");
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _; //This represent doing rest of the code
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    constructor(AggregatorV3Interface priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = priceFeedAddress;
    }

    function fund() public payable {
        require(
            msg.value.getConversion(s_priceFeed) > MINIMUM_USD,
            "Didn't send enough "
        );
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] = msg.value;
    }

    // function sWithdraw() public payable onlyOwner {
    //     for (uint i = 0; i < s_funders.length; i++) {
    //         s_addressToAmountFunded[s_funders[i]] = 0;
    //     }

    //     //Reset the array
    //     s_funders = new address[](0);

    //     //Withdraw the fund

    //     (bool callSuccess, ) = payable(msg.sender).call{
    //         value: address(this).balance
    //     }("");
    //     require(callSuccess, "Send failed");
    // }

    //This one is cheaper
    function Withdraw() public payable onlyOwner {
        address[] memory funders = s_funders;
        for (uint i = 0; i < funders.length; i++) {
            s_addressToAmountFunded[funders[i]] = 0;
        }
        s_funders = new address[](0);

        //Withdraw the fund

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Send failed");
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(address funder)
        public
        view
        returns (uint256)
    {
        return s_addressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}

/*  There are 3 ways to withdraw fund
        1.Transfer  transfer(2300 gas,throws error if get above)
        2.Send      send(2300 gas, return bool)
        3.Call      call(forward all gas or set gas,return bool)
    
        1 Transfer
        msg.sender is address type  to transfer fund we have to type cast in payable address
         payable(msg.sender).transfer(address(this).balance);

        2.Send
         bool sendSuccess =  payable(msg.sender).send(address(this).balance);
         require(sendSuccess,"Send failed");

        3.Call
        (bool callSuccess,)=payable(msg.sender).call{value:address(this).balance}("");
        require(callSuccess,"Send failed");
*/
/*
What happen if someone send this contact ETH without calling the fund function?
Solution we will call fund function through receive and fallback
                Receive and Fallback
                    is msg.data empty?
                        /      \
                     yes        no  
                receive()?     fallback()
                  /   \
                yes   no
           receive()  fallback() 
*/
