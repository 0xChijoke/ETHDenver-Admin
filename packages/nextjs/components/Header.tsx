// import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Faucet } from "~~/components/scaffold-eth";
import RainbowKitCustomConnectButton from "~~/components/scaffold-eth/RainbowKitCustomConnectButton";
// import { Bars3Icon, BugAntIcon, SparklesIcon } from "@heroicons/react/24/outline";
import BG from "~~/asset/BG.png";
import sporkLogo from "~~/asset/spork.png";

/**
 * Site header
 */
export default function Header() {
  return (
    <div className="bg-[#000c66] min-h-0 flex flex-wrap rounded-t-3xl">
      <div className="flex items-center h-fit w-full md:w-auto md:h-auto justify-between md:justify-start px-4 py-3">
        <div>
          <Link href="/" passHref>
            <a className="">
              <Image alt="SporkDAO logo" className="cursor-pointer" src={sporkLogo} width={65} height={60} />
            </a>
          </Link>
        </div>
        <div className="">
          <Link href="/" passHref>
            <a className="md:px-2">
              <Image alt="BuidlGuidl logo" className="cursor-pointer" src={BG} width={190} height={50} />
            </a>
          </Link>
        </div>
      </div>
      <div className="flex flex-grow w-full md:mr-3 justify-center md:w-auto items-center mb-4 md:justify-end">
        <RainbowKitCustomConnectButton />
        <Faucet />
      </div>
    </div>
  );
}
