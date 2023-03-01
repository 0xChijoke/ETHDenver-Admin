import React from "react";
import { useAccount } from "wagmi";
import VendorAddresses from "~~/components/VendorAddresses";

const Vendors = () => {
  const { address } = useAccount();

  if (address) {
    return (
      <div>
        <VendorAddresses />
      </div>
    );
  } else {
    return <div className="flex justify-center text-slate-300">Only the admin can view this page.</div>;
  }
};

export default Vendors;
