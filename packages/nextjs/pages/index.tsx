import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { ethers, Contract } from "ethers";
import ERC20ABI from "~~/abi/ERC20.json" assert { type: "json" };
import { useAccount } from "wagmi";
import VendorTransactions from "~~/components/VendorTransactions";
import Link from "next/link";

export const provider = new ethers.providers.JsonRpcProvider("https://zksync2-testnet.zksync.dev");
const buidlTokenAddress = "0xf551954D449eA3Ae4D6A2656a42d9B9081B137b4";
export const buidlContract = new Contract(buidlTokenAddress, ERC20ABI, provider);

const Home: NextPage = () => {
  const { address } = useAccount();

  const nav = () => {
    if (address) {
      return (
        <div className="flex text-center justify-center w-full text-white">
          <div className="flex justify-center uppercase ">
            <Link href={"/vendors"}>Manage vendors</Link>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <Head>
        <title>Admin Panel</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
      </Head>

      <div className="flex items-center flex-col flex-grow">
        {nav()}
        <VendorTransactions />
        {/* <Orders /> */}
      </div>
    </>
  );
};

export default Home;
