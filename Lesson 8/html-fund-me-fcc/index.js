// in front-end javascript, you can't use require
// import keyword is used

import { ethers } from "./ethers05.6.esm.min.js"
import { abi } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
connectButton.onclick = connect
fundButton.onclick = fund

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = "Connected!"
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        connectButton.innerHTML = "Please install metamask!"
    }
}

async function fund(ethAmount) {
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        // Three things we need to fund account:
        //      provider / connection to the blockchain
        //      signer / wallet / someone with some ETH to pay gas fees
        //      contract that we are interacting with: ABI & address needed
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(signer)
        const contract = "" // could not run this correctly due to an error in hardhat package.json
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            // we can listen for the tx to be mined
            // we can listen for an event
            await listenForTransactionMine(transactionResponse, provider)
        } catch (e) {
            console.log(e)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)

    provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
            `Completed with ${transactionReceipt.confirmations} confirmations`
        )
    })
    // return new Promise
    // the reason we're going to return a promise is we would like to have a listener monitoring the blockchain
    // ethers comes with a way to listen to events
}

// fund function

// withdraw function
