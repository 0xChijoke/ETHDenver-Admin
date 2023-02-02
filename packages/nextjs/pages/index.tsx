import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import Balance from "~~/components/Balance";
import Search from "~~/components/Search";
import Orders from "~~/components/Orders";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Scaffold-eth App</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
      </Head>

      <div className="flex items-center flex-col flex-grow">
        <Balance />
        <Search />
        <Orders />
      </div>
    </>
  );
};

export default Home;
