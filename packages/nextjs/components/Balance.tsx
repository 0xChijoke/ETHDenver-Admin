import React from "react";

function Balance() {
  return (
    <div className="flex flex-row bg-[#9EA1D4] rounded-b-3xl w-full p-5">
      <div className="flex flex-col w-1/3 md:w-1/4 items-start text-black text-left">
        <h6 className="tracking-widest md:text-sm">Total Orders</h6>
        <text className="text-5xl font-semibold py-3 md:text-7xl">317</text>
      </div>
      <div className="flex flex-col w-1/2 items-start text-black text-left">
        <h6 className="tracking-widest md:text-sm">Total Earned</h6>
        <text className="text-5xl font-semibold py-3 md:text-7xl">$1500</text>
      </div>
    </div>
  );
}

export default Balance;
