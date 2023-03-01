import React, { useState, useEffect } from "react";
import _ from "lodash";
import { db } from "~~/pages/api/config";
import { buidlContract, provider } from "~~/pages";
import { Transaction, Vendor } from "./VendorAddresses";
import Spinner from "./Spinner";
import { Address } from "./scaffold-eth";
import { formatUnits } from "ethers/lib/utils";

const VendorTransactions: React.FC = () => {
  const [vendorData, setVendorData] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    putTransactions();
    getTransactions();
  }, []);

  async function putTransactions() {
    const vendorAddresses = vendorData.map(vendor => vendor.address);

    // Retrieve the last queried block number from Firestore
    const lastQueriedBlock = await db
      .collection("metadata")
      .doc("lastQueriedBlock")
      .get()
      .then(doc => doc.data()?.blockNumber);
    const startBlock = lastQueriedBlock ? lastQueriedBlock + 1 : 0;
    const endBlock = await provider.getBlockNumber();

    const transferFilter = buidlContract.filters.Transfer(null, vendorAddresses);
    const transfers = await buidlContract.queryFilter(transferFilter, startBlock, endBlock);

    const batch = db.batch();

    for (const t of transfers) {
      const vendor = vendorData.find(vendor => vendor.address === t.args?.to);
      if (vendor) {
        const txData = {
          from: t.args?.from,
          to: t.args?.to,
          value: Number(formatUnits(t.args?.value, 2)),
          timestamp: new Date(),
          isPaid: false,
        };
        vendor.transactions.push(txData);
        const transactionRef = db.collection("transactions").doc();
        batch.set(transactionRef, txData);
      }
    }

    await batch.commit();

    const updatedVendors = vendorData.map(vendor => {
      const uniqueFromAddresses = Array.from(new Set(vendor.transactions.map(tx => tx.from)));
      return {
        ...vendor,
        userCount: uniqueFromAddresses.length,
        totalOrders: vendor.transactions.length,
      };
    });

    setVendorData(updatedVendors);

    // Update the last queried block number in Firestore
    await db.collection("metadata").doc("lastQueriedBlock").set({ blockNumber: endBlock });
  }

  // Fetches and buckets transfer events
  async function getTransactions() {
    const vendors: Vendor[] = [];
    const transactions: Transaction[] = [];

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

    const transactionsSnapshot = await db.collection("transactions").get();
    transactionsSnapshot.forEach(doc => {
      const transactionData = doc.data();
      const date = transactionData.timestamp;
      transactions.push({
        from: transactionData.from,
        to: transactionData.to,
        value: transactionData.value,
        timestamp: date.toDate(),
        isPaid: transactionData.isPaid,
      });
    });

    for (let i = 0; i < vendors.length; i++) {
      const vendorTransactions = transactions.filter(t => t.to === vendors[i].address && !t.isPaid);
      vendors[i].transactions = vendorTransactions;
      vendors[i].unpaidTotal = vendorTransactions.reduce((acc, cur) => acc + cur.value, 0);
      const v1uniq = _.uniqBy(vendorTransactions, "from");
      vendors[i].userCount = v1uniq.length;
      vendors[i].totalOrders = vendorTransactions.length;

      const balance = (await buidlContract.balanceOf(vendors[i].address)).toNumber() / 100;
      vendors[i].balance = balance;
    }

    setVendorData(vendors);
    setLoading(false);
  }

  // Handler for when a vendor row is clicked
  const handleVendorRowClick = (vendor: Vendor) => {
    if (selectedVendor === vendor) {
      setSelectedVendor(null);
    } else {
      setSelectedVendor(vendor);
    }
  };

  // Renders the transactions of the selected vendor
  const renderSelectedVendorTransactions = () => {
    if (!selectedVendor) {
      return null;
    }

    return (
      <tr>
        <td colSpan={4} className="w-full">
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-2">From</th>
                <th className="py-2">Amount (BUIDL)</th>
                <th className="py-2">Timestamp</th>
                <th className="py-2">Is Paid</th>
              </tr>
            </thead>
            <tbody>
              {selectedVendor.transactions.map(transaction => (
                <tr key={`${transaction.from}-${transaction.timestamp}`} className="bg-white text-center border-b">
                  <td className="py-4 px-6">
                    <Address address={transaction.from} />
                  </td>
                  <td className="py-4 px-6">{transaction.value}</td>
                  <td className="py-4 px-6">{transaction.timestamp.toDateString()}</td>
                  <td className="py-4 px-6">{transaction.isPaid ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </td>
      </tr>
    );
  };

  // Renders the table of vendors and their data
  const renderVendorTable = () => {
    if (loading) {
      return (
        <div className="items-center flex justify-center">
          <Spinner />
        </div>
      );
    }

    return (
      <div className="w-full">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2">Name</th>
              <th className="py-2">Address</th>
              <th className="py-2">New Orders</th>
            </tr>
          </thead>
          <tbody>
            {vendorData.map(vendor => (
              <React.Fragment key={vendor.id}>
                <tr
                  onClick={() => handleVendorRowClick(vendor)}
                  className="bg-white text-center border-b cursor-pointer"
                >
                  <td className="py-4 px-6 font-semibold">{vendor.name}</td>
                  <td className="py-4 px-6">
                    <Address address={vendor.address} />
                  </td>
                  <td className="py-4 px-6">{vendor.totalOrders}</td>
                </tr>
                {vendor === selectedVendor && renderSelectedVendorTransactions()}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden overflow-x-scroll md:overflow-auto">{renderVendorTable()}</div>
  );
};

export default VendorTransactions;
