import React, { useEffect, useState } from "react";
import { db } from "~~/pages/api/config";
import { Transaction, Vendor } from "./VendorAddresses";

function Balance() {
  const [totalValuePaid, setTotalValuePaid] = useState<number>(0);
  const [totalVendorOrders, setTotalVendorOrders] = useState<number>(0);

  useEffect(() => {
    sum();
  }, []);

  async function sum(): Promise<void> {
    const vendors: Vendor[] = [];

    try {
      const vendorsSnapshot = await db.collection("vendors").get();
      vendorsSnapshot.forEach(doc => {
        const vendorData = doc.data();
        vendors.push({
          id: doc.id,
          name: vendorData.name,
          address: vendorData.address,
          balance: vendorData.balance,
          transactions: [...vendorData.transactions],
          totalOrders: vendorData.totalOrders,
          userCount: vendorData.userCount,
          unpaidTotal: vendorData.unpaidTotal,
          paidTotal: vendorData.paidTotal,
        });
      });
      const transactions: Transaction[] = [];

      let paidTotal = 0;
      let unpaidTotal = 0;
      let totalOrders = 0;

      const transactionSnapshot = await db.collection("transactions").get();
      transactionSnapshot.forEach((doc: firebase.firestore.DocumentSnapshot<Transaction>) => {
        const transaction = doc.data() as Transaction;

        // Calculate the paid and unpaid amounts for the transaction
        if (transaction.isPaid) {
          paidTotal += Number(transaction.value);
        } else {
          unpaidTotal += Number(transaction.value);
        }

        transactions.push(transaction);
        totalOrders++;
      });
      setTotalValuePaid(paidTotal);
      setTotalVendorOrders(totalOrders);
      console.log(unpaidTotal);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex flex-row bg-[#000c66] rounded-b-3xl w-full p-5">
      <div className="flex flex-col w-1/3 md:w-1/4 items-start text-[#c3e0e5] text-left">
        <h6 className="tracking-widest md:text-sm">Total Orders</h6>
        <text className="text-5xl font-semibold text-white py-3 md:text-7xl">{totalVendorOrders}</text>
      </div>
      <div className="flex flex-col w-1/2 items-start text-[#c3e0e5] text-left">
        <h6 className="tracking-widest md:text-sm">Total paid</h6>
        <text className="text-5xl font-semibold py-3 text-white md:text-7xl">${totalValuePaid.toFixed(2)}</text>
      </div>
    </div>
  );
}

export default Balance;
