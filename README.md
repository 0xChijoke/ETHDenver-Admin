# Scaffold-Eth 2 & zkSync

This is a demo for a real-world usecase and demostrates how we can use a simple and intuitive interface for the management of onchain activities.
This panel is used for managing and monitoring vendor addresses for the purpose of record keeping, accounting and cashing out vendors for on-chain transactions.

This build uses the following tech stack:
- Scaffold-Eth-2
- Firestore
- zkSync


⚠️ This project is currently under active development. Things might break. Feel free to check the open issues & create new ones.

*The best way to get started building decentralized applications on Ethereum!*

A new version of [scaffold-eth](https://github.com/scaffold-eth/scaffold-eth/tree/master) with its core functionality. Built using NextJS, RainbowKit, Wagmi and Typescript.

- ✅ Contract component to easily edit the smart contracts and view & test the contract on your frontend
- 🔥 Burner wallet & local faucet
- 🔐 Integration with the different wallet providers

---

## Quickstart

1. Clone this repo & install dependencies

```
git clone https://github.com/EngrGord/ETHDenver-Admin.git
cd se-2
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`.

Run smart contract test with `yarn hardhat:test`

- Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`
- Edit your frontend in `packages/nextjs/pages`
- Edit your deployment scripts in `packages/hardhat/deploy`


