// in front-end javascript, you can't use require
// import keyword is used

import { ethers } from "./ethers05.6.esm.min.js"

const connectButton = document.getElementById("connect")
const fundButton = document.getElementById("fund")
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
    }
}

// fund function

// withdraw function
