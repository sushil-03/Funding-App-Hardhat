const { getNamedAccounts, ethers } = require("hardhat");
async function main() {
    console.log("Funding FundMe");

    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe", deployer);

    // const transactionResponse = await fundMe.getOwner();
    // await transactionResponse.wait(1);
    // console.log("Funded", transactionResponse);

    const transactionResponse = await fundMe.fund({
        value: ethers.utils.parseEther("0.1"),
    });
    await transactionResponse.wait(1);
    console.log("Funded");
}
main()
    .then(() => {
        console.log("Successfully executed");
    })
    .catch((e) => {
        console.log(e);
    });
