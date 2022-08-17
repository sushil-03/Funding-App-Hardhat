const { run } = require("hardhat");

const verify = async function verify(contractAddress, args) {
    console.log("Verifying contract");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (error) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified");
        } else {
            console.log("Unknown error", error);
        }
    }
};
// module.exports = verify;
module.exports = { verify };
