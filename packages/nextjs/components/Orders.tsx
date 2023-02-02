import React from "react";
import { Address } from "./scaffold-eth";

const Orders = () => {
  return (
    <div className="flex flex-col justify-between md:space-x-2 space-y-2 md:space-y-0 md:flex-row w-full">
      <div className="flex flex-col w-full rounded-3xl p-3 bg-[#A7FFE4] md:w-[%47]">
        <div className="flex flex-row justify-between">
          <h1 className="text-left text-3xl my-7 text-black">New Orders</h1>
          <div className="items-center flex">
            <button className="border border-slate-800 rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="black"
                className="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto bg-transperent text-black w-full flex-auto justify-center items-center">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User ID</th>
                <th>Amount</th>
                <th>Time</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-sm text-center">
                <th>C43MD</th>
                <td>
                  <Address address="0x1E8c64Fd8F94da1d0E23853118B7F73a7B467209" />
                </td>
                <td>$3500.00</td>
                <td className="text-sm">12 sec ago</td>
                <td>
                  <button className="py-1 my-2 px-4 border border-spacing-3 border-slate-800 rounded-3xl">Done</button>
                </td>
              </tr>
              <tr className="text-sm text-center">
                <th>C43MD</th>
                <td>
                  <Address address="0x1E8c64Fd8F94da1d0E23853118B7F73a7B467209" />
                </td>
                <td>$3500.00</td>
                <td className="text-sm">12 sec ago</td>
                <td>
                  <button className="py-1 my-2 px-4 border border-spacing-3 border-slate-800 rounded-3xl">Done</button>
                </td>
              </tr>
              <tr className="text-sm text-center">
                <th>C43MD</th>
                <td>
                  <Address address="0x1E8c64Fd8F94da1d0E23853118B7F73a7B467209" />
                </td>
                <td>$3500.00</td>
                <td className="text-sm">12 sec ago</td>
                <td>
                  <button className="py-1 my-2 px-4 border border-spacing-3 border-slate-800 rounded-3xl">Done</button>
                </td>
              </tr>
              <tr className="text-sm text-center">
                <th>C43MD</th>
                <td>
                  <Address address="0x1E8c64Fd8F94da1d0E23853118B7F73a7B467209" />
                </td>
                <td>$3500.00</td>
                <td className="text-sm">12 sec ago</td>
                <td>
                  <button className="py-1 my-2 px-4 border border-spacing-3 border-slate-800 rounded-3xl">Done</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col p-3 bg-[#E497CD] rounded-3xl w-full md:w-[%47]">
        <div className="flex flex-row">
          <h1 className="text-left text-3xl my-7 text-black">Orders Done</h1>
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto bg-transperent text-black w-full justify-center items-center">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User ID</th>
                <th>Amount</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-sm text-center">
                <th>C43MD</th>
                <td className="py-4">
                  <Address address="0x1E8c64Fd8F94da1d0E23853118B7F73a7B467209" />
                </td>
                <td>$3500.00</td>
                <td>12 sec ago</td>
              </tr>
              <tr className="text-sm text-center">
                <th>C43MD</th>
                <td className="py-4">
                  <Address address="0x1E8c64Fd8F94da1d0E23853118B7F73a7B467209" />
                </td>
                <td>$3500.00</td>
                <td>12 sec ago</td>
              </tr>
              <tr className="text-sm text-center">
                <th>C43MD</th>
                <td className="py-4">
                  <Address address="0x1E8c64Fd8F94da1d0E23853118B7F73a7B467209" />
                </td>
                <td>$3500.00</td>
                <td>12 sec ago</td>
              </tr>
              <tr className="text-sm text-center">
                <th>C43MD</th>
                <td className="py-4">
                  <Address address="0x1E8c64Fd8F94da1d0E23853118B7F73a7B467209" />
                </td>
                <td>$3500.00</td>
                <td>12 sec ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
