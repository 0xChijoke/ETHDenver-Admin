import { useEffect, useState } from "react";
import { formatUnits } from "@ethersproject/units";
import { Provider, Contract } from "zksync-web3";
import { useAccount } from "wagmi";

import ERC20ABI from "~~/abi/ERC20.json" assert { type: "json" };

const Vendors = () => {
  const provider = new Provider("https://zksync2-testnet.zksync.dev");
  const { address } = useAccount();
  const signer = provider.getSigner(address);
  const buidlTokenAddress = "0xf551954D449eA3Ae4D6A2656a42d9B9081B137b4";
  const vendorAddresses = ["0x0dc01C03207fB73937B4aC88d840fBBB32e8026d", "0x7EBa38e027Fa14ecCd87B8c56a49Fa75E04e7B6e"];
  const buidlContract = new Contract(buidlTokenAddress, ERC20ABI, signer);

  //Get the buidl contract BUIDL balance.
  const [buidlTokenBalance, setBuidltokenBalance] = useState<number>();
  const [vendor1Balance, setVendor1Balance] = useState<number>();
  const [vendor2Balance, setVendor2Balance] = useState<number>();
  const vendor1Transfers: any = [];
  const vendor2Transfers: any = [];

  useEffect(() => {
    getBalance();
  });

  let totalSupply;
  console.log("Total supply", totalSupply);

  async function getBalance() {
    totalSupply = buidlContract && (await buidlContract.totalSupply);
    const buidlTokenBalance = buidlTokenAddress && buidlContract && (await buidlContract.balanceOf(buidlTokenAddress));
    const buidlBalance = formatUnits(buidlTokenBalance, 2);
    setBuidltokenBalance(Number(buidlBalance));
    // Vendor 1 balance
    const vendor1TokenBalance = buidlContract && (await buidlContract.balanceOf(vendorAddresses[1]));
    const vendor1Balance = formatUnits(vendor1TokenBalance, 2);
    setVendor1Balance(Number(vendor1Balance));
    // Vendor 2 balance
    const vendor2TokenBalance = buidlContract && (await buidlContract.balanceOf(vendorAddresses[0]));
    const vendor2Balance = formatUnits(vendor2TokenBalance, 2);
    setVendor2Balance(Number(vendor2Balance));
  }

  buidlContract.on("Transfer", (from, to, value, event) => {
    const transferEvent = {
      from: from,
      to: to,
      value: value,
      eventData: event,
    };
    if (to == vendorAddresses[0]) {
      // vendor1Transfers.push(JSON.stringify(transferEvent, null, 4));
      console.log(from, formatUnits(value, 2));
    } else if (to == vendorAddresses[1]) {
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
        <p>Buidl contract Balance: BUIDL {buidlTokenBalance}</p>
        <p>Vendor1 Balance: BUIDL {vendor1Balance}</p>
        <p>Vendor2 Balance: BUIDL {vendor2Balance}</p>
      </div>
    </div>
  );
};

export default Vendors;
