import React, { useEffect, useState } from "react";
import { formatUnits } from "@ethersproject/units";
import { Provider, Contract } from "zksync-web3";
import { useAccount } from "wagmi";
import { allowList } from "./Addresses";

import ERC20ABI from "~~/abi/ERC20.json" assert { type: "json" };

const Vendors = () => {
  const provider = new Provider("https://zksync2-testnet.zksync.dev");
  const { address } = useAccount();
  const signer = provider.getSigner(address);
  const buidlTokenAddress = "0x1426BB23Ad8F7029618Cab37E39202a4B434508a";
  const buidlContract = new Contract(buidlTokenAddress, ERC20ABI, signer);

  //Get the buidl contract BUIDL balance.
  const [buidlTokenBalance, setBuidltokenBalance] = useState<string>();
  const [vendor1Balance, setVendor1Balance] = useState<string>();
  const [vendor2Balance, setVendor2Balance] = useState<string>();
  const vendor1Transfers: any = [];
  const vendor2Transfers: any = [];

  useEffect(() => {
    getBalance();
  });

  let totalSupply;
  console.log("Total supply", totalSupply);

  async function getBalance() {
    totalSupply = buidlContract && (await buidlContract.totalSupply());
    await totalSupply.wait();
    const buidlTokenBalance = buidlTokenAddress && buidlContract && (await buidlContract.balanceOf(buidlTokenAddress));
    const buidlBalance = formatUnits(buidlTokenBalance, 2);
    setBuidltokenBalance(buidlBalance);
    // Vendor 1 balance
    const vendor1TokenBalance = buidlContract && allowList && (await buidlContract.balanceOf(allowList[27]["address"]));
    const vendor1Balance = formatUnits(vendor1TokenBalance, 2);
    setVendor1Balance(vendor1Balance);
    // Vendor 2 balance
    const vendor2TokenBalance = buidlContract && allowList && (await buidlContract.balanceOf(allowList[28]["address"]));
    const vendor2Balance = formatUnits(vendor2TokenBalance, 2);
    setVendor2Balance(vendor2Balance);
  }

  // Listen to Transfer events in buidl contract
  const filter = buidlContract.filters.Transfer();
  buidlContract.on(filter, (from, to, amount) => {
    console.log(`Transfer event: from ${from}, to ${to}, amount ${amount}`);
  });

  buidlContract.on("Transfer", (from, to, value, event) => {
    const transferEvent = {
      from: from,
      to: to,
      value: value,
      eventData: event,
    };
    if (to == allowList[27]["address"]) {
      vendor1Transfers.push(JSON.stringify(transferEvent, null, 4));
    } else if (to == allowList[28]["address"]) {
      vendor2Transfers.push(JSON.stringify(transferEvent, null, 4));
    } else {
      console.log(JSON.stringify(transferEvent));
    }
  });
  console.log("vendor 1: ", vendor1Transfers[0]);
  console.log("vendor 2: ", vendor2Transfers[0]);

  return (
    <div className="w-full p-4 flex flex-col rounded-2xl bg-blue-900 text-white min-h-full">
      <div className="w-full ">
        <p>Buidl contract Balance: BUIDL {buidlTokenBalance || 0}</p>
        <p>Vendor1 Balance: BUIDL {vendor1Balance || 0}</p>
        <p>Vendor2 Balance: BUIDL {vendor2Balance || 0}</p>
      </div>
    </div>
  );
};

export default Vendors;
