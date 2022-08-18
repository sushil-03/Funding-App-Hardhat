import { ethers } from "./ethers5.6.esm.min.js";
import { contractAddress, abi } from "./constant.js";
const connectBtn = document.getElementById("connectedButton");
const fundBtn = document.getElementById("fund");
const balanceBtn = document.getElementById("balanceBtn");
const withdrawBtn = document.getElementById("withdrawBtn");
connectBtn.onclick = connect;
fundBtn.onclick = fund;
balanceBtn.onclick = balance;
withdrawBtn.onclick = withdraw;

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        console.log("Withdrawing");
        try {
            const transactionResponse = await contract.Withdraw();
            console.log(transactionResponse);
            await listenForTransactionMine(transactionResponse, provider);
            console.log("DOne");
        } catch (error) {
            console.log("Eerror", error);
        }
    }
}
async function balance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        console.log(ethers.utils.formatEther(balance));
    }
}
async function connect() {
    if (typeof window.ethereum !== "undefined") {
        //metamask is present
        console.log("Hey metamask is installed");
        await window.ethereum.request({ method: "eth_requestAccounts" });
        connectBtn.innerHTML = "Connected";
        const accounts = await ethereum.request({ method: "eth_accounts" });
        console.log(accounts);
    } else {
        connectBtn.innerHTML = "not";
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value || 0.1;
    console.log("Inside fund Function ", ethAmount);
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log("Provuder", provider);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            });
            console.log(transactionResponse);
            await listenForTransactionMine(transactionResponse, provider);
            console.log("DOne");
        } catch (error) {
            console.log("Error ", error);
        }
    }
}
function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`);
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                "Completed with transactionReceipt ",
                transactionReceipt.confirmations
            );
            resolve();
        });
    });
}
